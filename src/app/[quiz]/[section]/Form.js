'use client'

import { useReducer } from 'react';
import { produce } from 'immer';
import Question from './Question';
import { Button } from '@heroui/react';
import { useRouter } from 'next/navigation';

const SET_VALUE = 0;
const SET_ERROR = 1;

export default function Form({ quiz, section, questions, back, next, complete }) {
  const router = useRouter();

  const reducer = (state, action) => {
    switch (action.type) {
      case SET_VALUE:
        state.values[action.index] = action.value;
        state.errors[action.index] = action.value === -1;
        break;
      case SET_ERROR:
        state.errors[action.index] = action.value;
    }
  }

  const initialState = {
    values: Array(questions.length).fill(-1),
    errors: Array(questions.length).fill(false)
  };
  const setInitialState = () => {
    const localState = localStorage.getItem(`${quiz}section${section}`);
    return localState ? JSON.parse(localState) : initialState;
  };

  const [ state, dispatch ] = useReducer(produce(reducer), initialState, setInitialState);

  const updateStorage = () => {
    localStorage.setItem(`${quiz}section${section}`, JSON.stringify(state));
  }

  const validate = () => {
    let isValid = true;

    state.values.forEach((value, index) => {
      dispatch({ type: SET_ERROR, index, value: value === -1 });
      if (value === -1) isValid = false;
    });

    return isValid;
  }

  const handleSubmit = () => {
    const answers = [];
    for (let i = 0; i <= section; i++) {
      const part = JSON.parse(localStorage.getItem(`${quiz}section${i}`))
      answers.push(...part.values);
    }

    fetch(`/api/${quiz}/complete`, {
      method: 'POST',
      body: JSON.stringify(answers),
      headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json().then((json) => {
      router.push(next + (json.correct ? ('?code=' + json.code) : ''));
    }));
  }

  return <>
    {
      questions.map((question, index) => <Question
        key={index} {...question} value={state.values[index]} error={state.errors[index]}
        index={index} onChange={(value) => dispatch({ type: SET_VALUE, index, value })}
      />)
    }
    <div className="w-full flex justify-center gap-4">
      <Button color="default" onPress={() => {
        updateStorage();
        router.push(back);
      }}>Back</Button>
      <Button color="primary" onPress={() => {
        updateStorage();
        if (validate()) {
          if (complete) {
            handleSubmit();
          } else {
            router.push(next);
          }
        }
      }}>{complete ? 'Submit' : 'Next'}</Button>
    </div>
  </>;
}