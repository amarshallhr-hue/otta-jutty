import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Gamepad2 } from "lucide-react";
import { useState } from "react";

const TRUTHS = [
  "What's your most embarrassing moment with me?",
  "What did you first think when you saw me?",
  "What's your secret talent?",
  "What's the most romantic thing you've ever done?",
  "If you could change one thing about me, what would it be?",
  "What song reminds you of us?",
  "What's your biggest fear in our relationship?",
  "What's the best compliment you've ever received?",
  "What's one thing you've never told anyone?",
  "If we could live anywhere, where would you pick?",
  "What's the most childish thing you still do?",
  "What's your love language?",
  "Do you believe in soulmates?",
  "What's your favorite memory of us?",
  "What makes you feel most loved?",
  "What was your first impression of me?",
  "What's something you're insecure about?",
  "What's the most spontaneous thing you've done?",
  "If you wrote a book about us, what would you title it?",
  "What's the weirdest dream you've had about me?",
];

const DARES = [
  "Send a voice note saying 'I love you' dramatically.",
  "Describe our relationship using only emojis.",
  "Sing the chorus of our favorite song.",
  "Do your best impression of me.",
  "Tell me 3 things you love about me RIGHT NOW.",
  "Write a 2-line poem about us.",
  "Send a funny selfie right now.",
  "List 5 of my best qualities in 30 seconds.",
  "Text your bestie 'I'm in love' with no context.",
  "Do a silly dance and describe it.",
  "Say something in your best baby voice.",
  "Confess something you were too shy to say before.",
  "Make up a nickname for me right now.",
  "Serenade me with a made-up song.",
  "Describe what you'd cook for our perfect date night.",
  "Draw our couple portrait (using emojis only).",
  "Rate me out of 10 in 5 categories.",
  "Say 'I choose you every day' in 3 different accents.",
  "Tell me your most ridiculous fear.",
  "Send the 7th photo in your camera roll.",
];

const QUIZ_QUESTIONS = [
  {
    q: "What's the most important thing in a relationship?",
    options: ["Trust", "Money", "Looks", "Popularity"],
    answer: 0,
  },
  {
    q: "Love languages include:",
    options: ["Acts of Service", "Coding", "Singing", "Arguing"],
    answer: 0,
  },
  {
    q: "A healthy relationship involves:",
    options: ["Mutual respect", "Jealousy", "Secrecy", "Control"],
    answer: 0,
  },
  {
    q: "How often should couples communicate?",
    options: ["Regularly and openly", "Only when fighting", "Never", "Rarely"],
    answer: 0,
  },
  {
    q: "What is 'quality time'?",
    options: [
      "Being fully present together",
      "Watching TV separately",
      "Texting in same room",
      "Working side by side",
    ],
    answer: 0,
  },
  {
    q: "An apology should include:",
    options: ["Acknowledgment & change", "Blame", "Excuses", "Silence"],
    answer: 0,
  },
  {
    q: "Long distance works when:",
    options: [
      "There's communication & trust",
      "You ignore each other",
      "No contact rule",
      "Random check-ins",
    ],
    answer: 0,
  },
  {
    q: "Attachment styles include:",
    options: [
      "Secure, Anxious, Avoidant",
      "Hot, Cold, Warm",
      "High, Low, Medium",
      "Fast, Slow, Stop",
    ],
    answer: 0,
  },
  {
    q: "'Gaslighting' means:",
    options: [
      "Manipulating someone's reality",
      "Cooking dinner",
      "Lighting candles",
      "Being too honest",
    ],
    answer: 0,
  },
  {
    q: "The 5 love languages were created by:",
    options: ["Gary Chapman", "Sigmund Freud", "Oprah", "Taylor Swift"],
    answer: 0,
  },
];

const EMOJI_ROUNDS = [
  { emojis: "🌊🏄‍♂️☀️", answer: "surfing" },
  { emojis: "🌹💍💒", answer: "wedding" },
  { emojis: "🎬🍿🌙", answer: "movie night" },
  { emojis: "✈️🌍🎒", answer: "travel" },
  { emojis: "🎂🕯️🎁", answer: "birthday" },
  { emojis: "☕📖🌧️", answer: "cozy morning" },
  { emojis: "💪🏋️‍♀️🥤", answer: "gym" },
  { emojis: "🌮🌯🥑", answer: "mexican food" },
  { emojis: "🐶❤️👨‍👩‍👧", answer: "family" },
  { emojis: "🎵🎤🌟", answer: "karaoke" },
];

type GameKey = "tod" | "quiz" | "emoji" | "ttt" | null;

export default function GamesTab() {
  const [openGame, setOpenGame] = useState<GameKey>(null);

  const [todMode, setTodMode] = useState<"truth" | "dare">("truth");
  const [todCard, setTodCard] = useState("");

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);

  const [emojiRound, setEmojiRound] = useState(0);
  const [emojiInput, setEmojiInput] = useState("");
  const [emojiResult, setEmojiResult] = useState("");
  const [emojiDone, setEmojiDone] = useState(false);
  const [emojiScore, setEmojiScore] = useState(0);

  const [board, setBoard] = useState<("X" | "O" | null)[]>(Array(9).fill(null));
  const [tttTurn, setTttTurn] = useState<"X" | "O">("X");
  const [tttWinner, setTttWinner] = useState<"X" | "O" | "Draw" | null>(null);

  const drawTod = () => {
    const list = todMode === "truth" ? TRUTHS : DARES;
    setTodCard(list[Math.floor(Math.random() * list.length)]);
  };

  const answerQuiz = (idx: number) => {
    setQuizAnswered(idx);
    const correct = QUIZ_QUESTIONS[quizIndex].answer === idx;
    if (correct) setQuizScore((s) => s + 1);
    setTimeout(() => {
      setQuizAnswered(null);
      if (quizIndex + 1 >= QUIZ_QUESTIONS.length) {
        setQuizDone(true);
      } else {
        setQuizIndex((i) => i + 1);
      }
    }, 900);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizDone(false);
    setQuizAnswered(null);
  };

  const submitEmoji = () => {
    const correct = emojiInput
      .trim()
      .toLowerCase()
      .includes(EMOJI_ROUNDS[emojiRound].answer);
    setEmojiResult(
      correct
        ? "✅ Correct!"
        : `❌ It was: "${EMOJI_ROUNDS[emojiRound].answer}"`,
    );
    if (correct) setEmojiScore((s) => s + 1);
    setTimeout(() => {
      setEmojiResult("");
      setEmojiInput("");
      if (emojiRound + 1 >= EMOJI_ROUNDS.length) setEmojiDone(true);
      else setEmojiRound((r) => r + 1);
    }, 1200);
  };

  const resetEmoji = () => {
    setEmojiRound(0);
    setEmojiInput("");
    setEmojiResult("");
    setEmojiDone(false);
    setEmojiScore(0);
  };

  const checkTtt = (b: ("X" | "O" | null)[]): "X" | "O" | "Draw" | null => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (const [a, bb, c] of lines) {
      if (b[a] && b[a] === b[bb] && b[a] === b[c]) return b[a] as "X" | "O";
    }
    if (b.every(Boolean)) return "Draw";
    return null;
  };

  const playTtt = (i: number) => {
    if (board[i] || tttWinner) return;
    const newBoard = board.map((cell, idx) => (idx === i ? tttTurn : cell)) as (
      | "X"
      | "O"
      | null
    )[];
    const winner = checkTtt(newBoard);
    setBoard(newBoard);
    setTttWinner(winner);
    if (!winner) setTttTurn((t) => (t === "X" ? "O" : "X"));
  };

  const resetTtt = () => {
    setBoard(Array(9).fill(null));
    setTttTurn("X");
    setTttWinner(null);
  };

  const GAMES = [
    {
      key: "tod" as GameKey,
      emoji: "🎲",
      title: "Truth or Dare",
      desc: "Draw a random card & face the challenge!",
    },
    {
      key: "quiz" as GameKey,
      emoji: "🧠",
      title: "Couples Quiz",
      desc: "10 questions about love & relationships.",
    },
    {
      key: "emoji" as GameKey,
      emoji: "🤔",
      title: "Emoji Guessing",
      desc: "Guess what the emoji sequence means!",
    },
    {
      key: "ttt" as GameKey,
      emoji: "⭕",
      title: "Tic-Tac-Toe",
      desc: "Classic game for two — X vs O!",
    },
  ];

  return (
    <div>
      <div className="animated-gradient px-6 pt-12 pb-6">
        <div className="flex items-center gap-2 text-white">
          <Gamepad2 size={20} />
          <h1 className="text-xl font-black">Mini Games</h1>
        </div>
        <p className="text-white/80 text-sm mt-1">
          Play together, laugh together 💕
        </p>
      </div>

      <div className="px-4 py-4 grid grid-cols-2 gap-3">
        {GAMES.map((g, i) => (
          <button
            type="button"
            key={g.key}
            data-ocid={`games.item.${i + 1}`}
            onClick={() => setOpenGame(g.key)}
            className="bg-white rounded-2xl p-4 shadow-card text-left hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            <div className="text-3xl mb-2">{g.emoji}</div>
            <h3 className="font-bold text-sm">{g.title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{g.desc}</p>
          </button>
        ))}
      </div>

      {/* Truth or Dare */}
      <Dialog
        open={openGame === "tod"}
        onOpenChange={(o) => !o && setOpenGame(null)}
      >
        <DialogContent
          className="max-w-[90vw] rounded-2xl"
          data-ocid="games.dialog"
        >
          <DialogHeader>
            <DialogTitle>🎲 Truth or Dare</DialogTitle>
          </DialogHeader>
          <div className="flex gap-2 mb-4">
            {(["truth", "dare"] as const).map((mode) => (
              <Button
                key={mode}
                data-ocid={`games.${mode}.toggle`}
                onClick={() => {
                  setTodMode(mode);
                  setTodCard("");
                }}
                className={`pill-btn flex-1 font-bold ${todMode === mode ? "animated-gradient text-white border-0" : ""}`}
                variant={todMode === mode ? "default" : "outline"}
              >
                {mode === "truth" ? "🤍 Truth" : "🔥 Dare"}
              </Button>
            ))}
          </div>
          {todCard && (
            <div className="bg-accent rounded-2xl p-4 text-center min-h-[80px] flex items-center justify-center mb-4">
              <p className="font-semibold text-sm">{todCard}</p>
            </div>
          )}
          <Button
            data-ocid="games.primary_button"
            onClick={drawTod}
            className="pill-btn w-full animated-gradient text-white border-0 font-bold"
          >
            Draw a Card 🃏
          </Button>
        </DialogContent>
      </Dialog>

      {/* Couples Quiz */}
      <Dialog
        open={openGame === "quiz"}
        onOpenChange={(o) => !o && setOpenGame(null)}
      >
        <DialogContent
          className="max-w-[90vw] rounded-2xl"
          data-ocid="games.dialog"
        >
          <DialogHeader>
            <DialogTitle>🧠 Couples Quiz</DialogTitle>
          </DialogHeader>
          {quizDone ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-xl font-black mb-1">{quizScore}/10</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {quizScore >= 8
                  ? "Relationship experts! 💕"
                  : quizScore >= 5
                    ? "Pretty good! 😊"
                    : "Keep learning together! 📚"}
              </p>
              <Button
                data-ocid="games.secondary_button"
                onClick={resetQuiz}
                className="pill-btn animated-gradient text-white border-0"
              >
                Play Again 🔄
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-3">
                <span>Question {quizIndex + 1}/10</span>
                <span>Score: {quizScore}</span>
              </div>
              <p className="font-bold text-sm mb-3">
                {QUIZ_QUESTIONS[quizIndex].q}
              </p>
              <div className="space-y-2">
                {QUIZ_QUESTIONS[quizIndex].options.map((opt, oi) => {
                  let cls =
                    "w-full text-left px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ";
                  if (quizAnswered === null) cls += "hover:bg-accent";
                  else if (oi === QUIZ_QUESTIONS[quizIndex].answer)
                    cls += "bg-green-100 border-green-400";
                  else if (oi === quizAnswered)
                    cls += "bg-red-100 border-red-400";
                  return (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => quizAnswered === null && answerQuiz(oi)}
                      className={cls}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Emoji Guessing */}
      <Dialog
        open={openGame === "emoji"}
        onOpenChange={(o) => !o && setOpenGame(null)}
      >
        <DialogContent
          className="max-w-[90vw] rounded-2xl"
          data-ocid="games.dialog"
        >
          <DialogHeader>
            <DialogTitle>🤔 Emoji Guessing</DialogTitle>
          </DialogHeader>
          {emojiDone ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-3">🏆</div>
              <h3 className="text-xl font-black mb-1">{emojiScore}/10</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {emojiScore >= 8
                  ? "Emoji master! 🤩"
                  : emojiScore >= 5
                    ? "Not bad! 😊"
                    : "Keep practicing! 📚"}
              </p>
              <Button
                onClick={resetEmoji}
                className="pill-btn animated-gradient text-white border-0"
              >
                Play Again 🔄
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-3">
                <span>Round {emojiRound + 1}/10</span>
                <span>Score: {emojiScore}</span>
              </div>
              <div className="text-center text-5xl my-4 bg-accent rounded-2xl py-6">
                {EMOJI_ROUNDS[emojiRound].emojis}
              </div>
              {emojiResult && (
                <div className="text-center text-sm font-bold mb-2">
                  {emojiResult}
                </div>
              )}
              <Input
                data-ocid="games.input"
                value={emojiInput}
                onChange={(e) => setEmojiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitEmoji()}
                placeholder="What does this mean?"
                className="mb-3"
              />
              <Button
                data-ocid="games.submit_button"
                onClick={submitEmoji}
                className="pill-btn w-full animated-gradient text-white border-0"
              >
                Guess! 🎯
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Tic-Tac-Toe */}
      <Dialog
        open={openGame === "ttt"}
        onOpenChange={(o) => !o && setOpenGame(null)}
      >
        <DialogContent
          className="max-w-[90vw] rounded-2xl"
          data-ocid="games.dialog"
        >
          <DialogHeader>
            <DialogTitle>⭕ Tic-Tac-Toe</DialogTitle>
          </DialogHeader>
          {tttWinner && (
            <div className="text-center text-lg font-black mb-2">
              {tttWinner === "Draw"
                ? "It's a Draw! 🤝"
                : `${tttWinner} Wins! 🎉`}
            </div>
          )}
          {!tttWinner && (
            <p className="text-center text-sm text-muted-foreground mb-3">
              Turn: <span className="font-bold">{tttTurn}</span>
            </p>
          )}
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <button
                type="button"
                key={i}
                data-ocid={`games.item.${i + 1}`}
                onClick={() => playTtt(i)}
                className={`aspect-square rounded-xl text-3xl font-black flex items-center justify-center transition-all ${
                  board[i] ? "bg-accent" : "bg-muted hover:bg-accent"
                } ${board[i] === "X" ? "text-pink-500" : "text-blue-500"}`}
              >
                {board[i]}
              </button>
            ))}
          </div>
          <Button
            data-ocid="games.cancel_button"
            onClick={resetTtt}
            variant="outline"
            className="pill-btn w-full"
          >
            Reset 🔄
          </Button>
        </DialogContent>
      </Dialog>

      <div className="text-center py-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
