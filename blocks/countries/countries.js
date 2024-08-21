// Function to update table content
async function updateContent(url, offset) {
  const existingWrapper = document.querySelector('.table-wrapper');
  if (existingWrapper) {
    const newWrapper = await createTableStructure(url, offset);
    existingWrapper.replaceWith(newWrapper);
  }
}

// Function to create header row
function createHeaderRow(table) {
  const headers = ['ID', 'Country', 'Continent'];
  const headerRow = document.createElement('tr');

  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);
}

// Function to create a data row
function createDataRow(table, row, index) {
  const dataRow = document.createElement('tr');

  const data = [index, row.Country, row.Continent];

  data.forEach((item) => {
    const td = document.createElement('td');
    td.textContent = item;
    dataRow.appendChild(td);
  });

  table.appendChild(dataRow);
}

// Function to create table structure with data and pagination
async function createTableStructure(url, offset = 0, limit = 10) {
  const fullUrl = `${url}?offset=${offset}&limit=${limit}`;
  const response = await fetch(fullUrl);
  const data = await response.json();

  // Create a wrapper div
  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'table-wrapper';

  const table = document.createElement('table');
  table.className = 'data-table';

  createHeaderRow(table);

  data.data.forEach((row, index) => {
    createDataRow(table, row, offset + index + 1);
  });

  // Append the table to the wrapper
  wrapperDiv.appendChild(table);

  // Pagination controls
  const paginationDiv = document.createElement('div');
  paginationDiv.className = 'pagination-controls';

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Previous';
  prevButton.disabled = offset === 0;
  prevButton.addEventListener('click', () => {
    updateContent(url, Math.max(0, offset - limit));
  });

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = offset === 40;
  nextButton.addEventListener('click', () => {
    updateContent(url, offset + limit);
  });

  paginationDiv.append(prevButton, nextButton);

  // Append the pagination controls next to the table
  wrapperDiv.appendChild(paginationDiv);

  return wrapperDiv;
}

export default async function decorate(block) {
  const link = block.querySelector('a[href$=".json"]');
  if (!link) return;

  const parentDiv = document.createElement('div');
  parentDiv.className = 'countries-block';

  const initialTable = await createTableStructure(link.href);
  parentDiv.appendChild(initialTable);
  link.replaceWith(parentDiv);
}
