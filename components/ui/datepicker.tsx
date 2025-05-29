'use client'

import React from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DatePickerProps {
  date: Date | undefined
  onChange: (date: Date | null) => void
}

export const DatePicker: React.FC<DatePickerProps> = ({ date, onChange }) => {
  return (
    <ReactDatePicker
      selected={date}
      onChange={onChange}
      dateFormat="yyyy-MM-dd"
      className="border px-3 py-2 rounded-md w-full"
      placeholderText="Selecciona una fecha"
    />
  )
}
