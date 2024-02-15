const playerBoard = document.getElementById("playerBoard");

initializeBoard = () => {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let grid = document.createElement("div");
      grid.classList.add(
        "w-[32px]",
        "h-[32px]",
        "bg-white",
        "outline",
        "outline-1",
        "outline-purple-900"
      );
      grid.setAttribute("data-y", y);
      grid.setAttribute("data-x", x);
      //   `<div data-y=${y} data-x=${x} class="w-[32px] h-[32px] bg-white border border-slate-700"></div>`;
      playerBoard.appendChild(grid);
    }
  }
};

initializeBoard();
