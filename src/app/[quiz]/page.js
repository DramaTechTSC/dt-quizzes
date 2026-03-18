import clientPromise from '@/lib/mongo';
import { ObjectId } from 'mongodb';
import Header from './Header';

export default async function Page({ params }) {
  const { quiz } = await params;
  const conn = await clientPromise;
  const quizzes = conn.db('quiz').collection('quizzes');
  const record = await quizzes.findOne({_id: new ObjectId(quiz)}, {projection: { _id: 0, title: 1, description: 1 }});

  return <Header {...record} link={`/${quiz}/0`} />
}