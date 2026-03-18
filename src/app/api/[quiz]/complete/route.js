import clientPromise from "@/lib/mongo";
import digest from '@/lib/hash';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers';

export async function POST(req, { params }) {
  const cookieStore = await cookies();

  const body = await req.json();
  const { quiz } = await params;

  const client = await clientPromise;
  const quizzes = client.db('quiz').collection('quizzes');

  const agg = await quizzes.aggregate([
    { $match: { _id: new ObjectId(quiz) } },
    { $unwind: "$sections" },
    { $unwind: "$sections.questions" },
    { $lookup: { from: "questions", localField: "sections.questions", foreignField: "_id", as: "questionDoc" } },
    { $unwind: "$questionDoc" },
    { $group: { _id: "$_id", answers: { $push: "$questionDoc.correct" } } },
    { $project: { _id: 0, answers: 1 } }
  ]).toArray();

  const answers = agg[0]?.answers ?? [];

  for (let i = 0; i < answers.length; i++) {
    if (answers[i] !== Number(body[i])) {
      return Response.json({ ok: true, correct: false })
    }
  }

  const codes = client.db('quiz').collection('codes');

  const token = cookieStore.get('token');
  if (!token || !token.value) {
    return Response.json({ error: 'You must request a device token before submitting' }, { status: 401 });
  }

  const raw = req.headers.get('user-agent') + req.headers.get('accept-language');
  const fingerprint = await digest(raw);

  const existing = await codes.findOne({ quiz: new ObjectId(quiz), token });
  if (existing) {
    const code = await digest(existing._id.toString());
    return Response.json({ ok: true, correct: true, code });
  }

  const result = await codes.insertOne({ quiz: new ObjectId(quiz), token: token.value, fingerprint });
  const code = await digest(result.insertedId.toString());

  return Response.json({ ok: true, correct: true, code });
}