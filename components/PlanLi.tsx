import { CheckIcon } from '@heroicons/react/solid'
import React from 'react'

interface Props {
  text:string
  }
  
export default function PlanLi({text}:Props) {
  return (
    <li className="flex items-center gap-x-2 text-lg">
    <CheckIcon className="h-7 w-7 text-[#E50914]" /> {text}
  </li>
  )
}
