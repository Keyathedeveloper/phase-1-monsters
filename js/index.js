document.addEventListener('DOMContentLoaded', () => {
    const monsterForm = document.getElementById('monster-form');
    const monsterList = document.getElementById('monster-list');
    const loadMoreButton = document.getElementById('load-more');
    let currentPage = 1;
    const limit = 50;

    const fetchMonsters = async (page = 1, limit = 50) => {
      try {
        const response = await fetch(`http://localhost:3000/monsters/?_limit=${limit}&_page=${page}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const monsters = await response.json();
        return monsters;
      } catch (error) {
        console.error('Failed to fetch monsters:', error);
      }
    };

    const createMonsterElement = (monster) => {
      const monsterDiv = document.createElement('div');
      monsterDiv.classList.add('monster');
      monsterDiv.innerHTML = `
        <h2>${monster.name}</h2>
        <p>Age: ${monster.age}</p>
        <p>${monster.description}</p>
      `;
      return monsterDiv;
    };

    const renderMonsters = (monsters) => {
      monsters.forEach(monster => {
        const monsterElement = createMonsterElement(monster);
        monsterList.appendChild(monsterElement);
      });
    };

    const loadMonsters = async () => {
      const monsters = await fetchMonsters(currentPage, limit);
      if (monsters) {
        renderMonsters(monsters);
        currentPage++;
        if (monsters.length === limit) {
          loadMoreButton.style.display = 'block';
        } else {
          loadMoreButton.style.display = 'none';
        }
      }
    };

    monsterForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const formData = new FormData(monsterForm);
      const newMonster = {
        name: formData.get('name'),
        age: Number(formData.get('age')),
        description: formData.get('description')
      };

      try {
        const response = await fetch('http://localhost:3000/monsters', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(newMonster)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const monster = await response.json();
        const monsterElement = createMonsterElement(monster);
        monsterList.prepend(monsterElement);
        monsterForm.reset();
      } catch (error) {
        console.error('Failed to create monster:', error);
      }
    });

    loadMoreButton.addEventListener('click', loadMonsters);

    // Initial load
    loadMonsters();
  });
