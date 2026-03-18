'use server'

import clientPromise from '@/lib/mongo';
import { ObjectId } from 'mongodb';
import Header from '../Header';
import Form from './Form';
import { cookies } from 'next/headers';

export default async function Page({ params }) {
  const { quiz, section } = await params;
  const sectionNumber = Number(section);
  const conn = await clientPromise;

  const quizzes = conn.db('quiz').collection('quizzes');
  const collection = conn.db('quiz').collection('questions');

  const record = await quizzes.findOne({_id: new ObjectId(quiz)}, {projection: { _id: 0, sections: 1 }});
  const { title, description, questions } = record.sections[sectionNumber];

  const cursor = await collection.find({ _id: { $in: questions } }, { projection: { _id: 0, text: 1, answers: 1 } });
  const records = await cursor.toArray();

  const opts = {
    quiz, section: sectionNumber, complete: sectionNumber === record.sections.length - 1,
    back: `/${quiz}` + (sectionNumber === 0 ? '' : `/${sectionNumber - 1}`),
    next: `/${quiz}` + (sectionNumber === record.sections.length - 1 ? '/complete' : `/${sectionNumber + 1}`)
  }

  console.log(opts);

  return <>
    <Header title={title} description={description} />
    <Form questions={records} {...opts} />
  </>
}