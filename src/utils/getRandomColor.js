export const getRandomColor = () => {
  const coolColor = [
    "bg-red-900",
    "bg-orange-900",
    "bg-amber-900",
    "bg-yellow-900",
    "bg-lime-900",
    "bg-green-900",
    "bg-emerald-900",
    "bg-teal-900",
    "bg-cyan-900",
    "bg-sky-900",
    "bg-blue-900",
    "bg-indigo-900",
    "bg-violet-900",
    "bg-purple-900",
    "bg-fuchsia-900",
    "bg-pink-900",
    "bg-rose-900",
  ];
  const randomNumber = Math.floor(Math.random() * coolColor.length);
  return coolColor[randomNumber];
};

