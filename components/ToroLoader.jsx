import ToretBull from './ToretBull'

export default function ToroLoader({ text = "Processing" }) {
  return (
    <div className="absolute inset-0 z-50 bg-[#132600] flex flex-col items-center justify-center transition-opacity rounded-[inherit]">
      <div className="relative flex items-center justify-center w-20 h-20 mb-4">
        <div className="absolute inset-0 w-full h-full rounded-full border-[1.5px] border-transparent border-t-[#C9963E] border-r-[#C9963E]/50 border-b-[#C9963E]/10 animate-spin"></div>
        
        <div className="w-9 h-9 text-[#FAFAF7] opacity-90">
          <ToretBull className="w-full h-full" />
        </div>
      </div>
      
      <p className="text-[#C9963E] text-sm font-semibold tracking-widest uppercase animate-pulse">
        {text}...
      </p>
    </div>
  )
}