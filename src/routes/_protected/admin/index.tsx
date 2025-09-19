import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_protected/admin/')({
  component: RouteComponent,
})

function RouteComponent() {
    const [count, setCount] = useState(0);


  function MyButton() {

    function handleCount() {
      return setCount(count + 1)
    }

    return <div>
      <button onClick={handleCount}>Clicked {count} times</button>
    </div >
  }
  return <div>
    <MyButton />
    <MyButton />

  </div>
}
