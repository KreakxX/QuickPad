export default function FileBar() {
  return (
    <div className="flex h-8 bg-[#252526] border-b border-[#3e3e42] select-none">
      <div className="px-3 flex items-center text-xs text-[#d4d4d4] border-r border-[#3e3e42] hover:bg-[#333333] cursor-default">
        index.js
      </div>
      <div className="px-3 flex items-center text-xs text-[#d4d4d4] border-r border-[#3e3e42] hover:bg-[#333333] cursor-default">
        styles.css
      </div>
      <div className="px-3 flex items-center text-xs text-[#d4d4d4] border-r border-[#3e3e42] hover:bg-[#333333] cursor-default">
        README.md
      </div>
    </div>
  );
}
