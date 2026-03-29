interface Props {
  onSelect: (sticker: string) => void;
  onClose: () => void;
}

const STICKERS = {
  Love: ["💕", "💖", "💗", "💝", "💘", "🥰", "😘", "💋", "💑", "👫"],
  Funny: ["😂", "🤣", "😜", "😝", "🤪", "😹", "🙈", "🤡", "💀", "😭"],
  Mood: ["😊", "😢", "🥺", "😤", "😍", "🤩", "😴", "🤔", "😎", "🫂"],
};

export default function StickerPicker({ onSelect, onClose }: Props) {
  return (
    <div
      className="bg-white rounded-2xl shadow-card p-3"
      data-ocid="chat.modal"
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-muted-foreground">STICKERS</p>
        <button
          type="button"
          onClick={onClose}
          className="text-muted-foreground text-lg leading-none"
        >
          ×
        </button>
      </div>
      {Object.entries(STICKERS).map(([cat, stickers]) => (
        <div key={cat} className="mb-2">
          <p className="text-[10px] font-semibold text-muted-foreground mb-1">
            {cat.toUpperCase()}
          </p>
          <div className="flex flex-wrap gap-1">
            {stickers.map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => onSelect(s)}
                className="text-2xl hover:scale-125 transition-transform w-9 h-9 flex items-center justify-center rounded-xl hover:bg-accent"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
