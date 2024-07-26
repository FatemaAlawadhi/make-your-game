function ShowForm(Case) {
  const Form = document.querySelector(".FormContainer");
  Form.style.display = "flex";
  TextContent = document.querySelector(`.${Case}`);
  TextContent.style.display = "block";
}

function RemoveForm() {
  const Form = document.querySelector(".FormContainer");
  Form.style.display = "none";
  let TextContent = document.querySelector(`.win`);
  TextContent.style.display = "none";
  TextContent = document.querySelector(`.loss`);
  TextContent.style.display = "none";
}

var socket = new WebSocket("ws://localhost:8080/get");
socket.onopen = () => {
  console.log("Status: you connected");
};

function AddScore(score, timer) {
  const inputElement = document.querySelector(".UserNameInput");
  const UserName = inputElement.value;
  if (UserName === "") {
    alert("Please fill in the username field.");
    return;
  } else if (UserName.length > 10) {
    alert("username length should not exceed 10 char.");
    return;
  }

  const Time = 60 - parseInt(timer);

  if (UserName) {
    socket.send(
      JSON.stringify({ name: UserName, score: parseInt(score), time: Time })
    );
  }
  RemoveForm();
}

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  renderTable(data);
  globalData = data;
  console.log(data);
};

let globalData;

function renderTable(data, pageNumber = 1) {
  const tableContainer = document.getElementById("table-container");
  const paginationContainer = document.getElementById("pagination");
  const messageContainer = document.getElementById("message-container");
  const message = document.createElement("p");
  message.textContent = data.Message;

  let pageSize = 7;

  // Calculate the start and end indices for the current page
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;

  // Create the table element
  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  const headers = ["Rank", "Name", "Score", "Time"];
  headers.forEach((header) => {
    const th = document.createElement("th");
    th.textContent = header;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Populate the table with the data for the current page
  for (let i = startIndex; i <= endIndex && i < data.Data.length; i++) {
    const player = data.Data[i];
    const row = document.createElement("tr");
    const cells = [
      player.rank,
      truncateName(player.name),
      player.score,
      `${player.time}s`,
    ];
    cells.forEach((cellValue) => {
      const td = document.createElement("td");
      td.textContent = cellValue;
      row.appendChild(td);
    });
    table.appendChild(row);
  }

  // Clear the table container and add the table
  tableContainer.innerHTML = "";
  tableContainer.appendChild(table);
  messageContainer.innerHTML = "";
  messageContainer.appendChild(message);

  // Render pagination
  renderPagination(pageNumber, pageSize, data.Data.length, paginationContainer);
}

function renderPagination(
  pageNumber,
  pageSize,
  totalItems,
  paginationContainer
) {
  // Calculate the total number of pages
  const totalPages = Math.ceil(totalItems / pageSize);

  // Create the pagination element
  const pagination = document.createElement("div");
  pagination.innerHTML = `Page ${pageNumber}/${totalPages}`;

  // Add previous page button if not on the first page
  if (pageNumber > 1) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "<";
    prevButton.className = "PrevButton";
    prevButton.addEventListener("click", () => {
      renderTable(globalData, pageNumber - 1);
    });
    pagination.insertBefore(prevButton, pagination.firstChild);
  }

  // Add next page button if not on the last page
  if (pageNumber < totalPages) {
    const nextButton = document.createElement("button");
    nextButton.textContent = ">";
    nextButton.className = "NextButton";
    nextButton.addEventListener("click", () => {
      renderTable(globalData, pageNumber + 1);
    });
    pagination.appendChild(nextButton);
  }

  // Clear the pagination container and add the pagination
  paginationContainer.innerHTML = "";
  paginationContainer.appendChild(pagination);
}

function truncateName(name) {
  if (name.length > 5) {
    return name.substring(0, 5) + "..";
  }
  return name;
}
