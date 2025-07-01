import { cn } from '@/utils/cn';
import React from 'react'
import { IoSearch } from 'react-icons/io5'

type Props = {
  className?: string
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export default function Searchbox(props: Props) {
  return (
    <form 
      className={cn(
        'flex relative items-center justify-center h-10',
        props.className
      )} 
      onSubmit={props.onSubmit}
    >
      <input 
        type="text" 
        placeholder='Search location...' 
        value={props.value}
        className="w-64 px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-all duration-300"
        onChange={props.onChange}
      />

      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors">
        <IoSearch />
      </button>
    </form>
  );
}