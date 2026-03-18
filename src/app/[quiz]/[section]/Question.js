'use client'

import { Card, CardBody, CardHeader, Radio, RadioGroup } from '@heroui/react';

export default function Question({ index, text, answers, error, value, onChange }) {
  return <Card className="w-full p-4">
    <CardHeader>
      <h4>Question {index + 1}</h4>
    </CardHeader>
    <CardBody>
      <RadioGroup
        label={text} isInvalid={error} value={value}
        onValueChange={onChange} errorMessage="Please select an answer."
      >
        {answers.map((answer, index) => <Radio key={index} value={index}>{answer}</Radio>)}
      </RadioGroup>
    </CardBody>
  </Card>
}