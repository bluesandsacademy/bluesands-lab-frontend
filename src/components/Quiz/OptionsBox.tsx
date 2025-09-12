"use client"
import { useState } from "react"

interface OptionProps{
    options: string[]
}

const OptionsBox = (options: OptionProps) => {
    const [selected, setSelected] = useState(Number)
  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-6 bg-gray-200 text-black w-48 rounded-md">
                <p>option of the first instance</p>
            </div>
        </div>
    </div>
  )
}

export default OptionsBox