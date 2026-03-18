'use client'

import { Card, CardHeader, CardBody, CardFooter, Button, Link } from '@heroui/react';

export default function Header({ title, description, link }) {
  return <Card className="w-full p-4">
    <CardHeader>
      <h3>{title}</h3>
    </CardHeader>
    <CardBody>
      <p>{description}</p>
    </CardBody>
    {link && <CardFooter className="flex justify-center">
      <Button as={Link} color="primary" href={link}>Start</Button>
    </CardFooter>}
  </Card>
}