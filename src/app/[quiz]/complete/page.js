'use client'

import { useParams, useSearchParams } from 'next/navigation';
import { Button, Card, CardBody, CardFooter, CardHeader, Link } from '@heroui/react';

export default function Page() {
  const url = useSearchParams();
  const params = useParams();

  const code = url.get('code');

  return <Card className="w-full p-4">
    <CardHeader>
      <h3>{code ? "You did it!" : "Not quite..."}</h3>
    </CardHeader>
    <CardBody>
      {code ? <>
        <p>You correctly answered all the questions. Your access code is below. You may now close this tab.</p>
        <p className="font-bold mt-2">Access Code: {code}</p>
      </> : <p>At least one of your answers is incorrect. Please try again.</p>}
    </CardBody>
    {!code && <CardFooter><Button as={Link} href={`/${params.quiz}`} color="primary">Try Again</Button></CardFooter>}
  </Card>
}