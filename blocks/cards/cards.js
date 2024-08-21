import { createOptimizedPicture, fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
  const placeholders = await fetchPlaceholders('');
  const { clickHereForMore } = placeholders;

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    const divWrapper = document.createElement('div');
    const url = '/home';
    const footer = `<a href='${url}'>${clickHereForMore}</a>`;
    divWrapper.classList.add('cards-card-footer');
    divWrapper.innerHTML = footer;
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((childDiv) => {
      if (childDiv.children.length === 1 && childDiv.querySelector('picture')) {
        childDiv.className = 'cards-card-image';
      } else {
        childDiv.className = 'cards-card-body';
      }
    });
    ul.append(li);
    li.append(divWrapper);
  });
  
  ul.querySelectorAll('picture > img').forEach((img) => 
    img.closest('picture').replaceWith(
      createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])
    )
  );

  block.textContent = '';
  block.append(ul);
}
