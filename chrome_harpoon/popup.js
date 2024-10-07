document.addEventListener('DOMContentLoaded', () => {
  const tabList = document.getElementById('tabList');
  const themeSwitch = document.getElementById('themeSwitch');
  const themeIcon = document.getElementById('themeIcon');

  // Load the marked tabs from storage
  chrome.storage.local.get('markedTabs', (data) => {
      const markedTabs = data.markedTabs || [];
      renderTabList(markedTabs);
  });

  // Check and set the last used theme
  chrome.storage.local.get('isLightTheme', (data) => {
      const isLightTheme = data.isLightTheme || false;
      document.body.classList.toggle('light-theme', isLightTheme);
      themeIcon.src = isLightTheme ? 'sun.png' : 'moon.png'; // Set icon based on theme
  });

  themeSwitch.addEventListener('click', () => {
      // Toggle the theme
      const isLightTheme = document.body.classList.toggle('light-theme');
      themeIcon.src = isLightTheme ? 'sun.png' : 'moon.png'; // Change icon based on theme
      
      // Save the current theme state
      chrome.storage.local.set({ isLightTheme });
  });

  function renderTabList(markedTabs) {
      tabList.innerHTML = ''; // Clear the list
      markedTabs.forEach((tab, index) => {
          const listItem = document.createElement('li');
          listItem.textContent = `Tab ${index + 1}: ${tab.title}`;  // Use the tab title here

          // Create "Remove" button
          const removeBtn = document.createElement('button');
          removeBtn.textContent = 'Remove';
          removeBtn.onclick = () => removeTab(index);

          // Create "Move Up" button
          const moveUpBtn = document.createElement('button');
          moveUpBtn.textContent = 'Up';
          moveUpBtn.onclick = () => moveTab(index, -1);

          // Create "Move Down" button
          const moveDownBtn = document.createElement('button');
          moveDownBtn.textContent = 'Down';
          moveDownBtn.onclick = () => moveTab(index, 1);

          listItem.appendChild(removeBtn);
          listItem.appendChild(moveUpBtn);
          listItem.appendChild(moveDownBtn);
          tabList.appendChild(listItem);
      });
  }

  // Function to remove a tab
  function removeTab(index) {
      chrome.storage.local.get('markedTabs', (data) => {
          const markedTabs = data.markedTabs || [];
          markedTabs.splice(index, 1); // Remove the tab at the given index
          chrome.storage.local.set({ markedTabs });
          renderTabList(markedTabs); // Re-render the list
      });
  }

  // Function to move a tab up or down
  function moveTab(index, direction) {
      chrome.storage.local.get('markedTabs', (data) => {
          const markedTabs = data.markedTabs || [];
          const newIndex = index + direction;

          // Ensure the new index is within bounds
          if (newIndex >= 0 && newIndex < markedTabs.length) {
              // Swap the tabs
              const temp = markedTabs[newIndex];
              markedTabs[newIndex] = markedTabs[index];
              markedTabs[index] = temp;

              chrome.storage.local.set({ markedTabs });
              renderTabList(markedTabs); // Re-render the list
          }
      });
  }
});
