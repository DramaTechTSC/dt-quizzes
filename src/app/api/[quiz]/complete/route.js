import clientPromise from "@/lib/mongo";
import digest from '@/lib/hash';
import { ObjectId } from 'mongodb';

export async function POST(req, { params }) {
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
      return Response.json({ correct: false })
    }
  }

  const codes = client.db('quiz').collection('codes');
  const result = await codes.insertOne({ quiz: new ObjectId(quiz) });
  const code = await digest(result.insertedId.toString());

  return Response.json({ correct: true, code });
}