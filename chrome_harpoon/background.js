let markedTabs = [];

// Listen for the keyboard shortcut command
chrome.commands.onCommand.addListener((command) => {
  if (command === "mark-tab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];

      // Check if current tab is already marked
      const existingTabIndex = markedTabs.findIndex(t => t.id === currentTab.id);

      if (existingTabIndex === -1) {
        // If it's not marked, add the current tab's id and title
        markedTabs.push({ id: currentTab.id, title: currentTab.title });
        chrome.storage.local.set({ markedTabs });
        console.log(`Tab marked: ${currentTab.id}, Title: ${currentTab.title}`);
      } else {
        console.log(`Tab is already marked: ${currentTab.id}`);
      }
    });
  } else if (command.startsWith("go-to-tab")) {
    const index = parseInt(command.split("-")[3]) - 1; // Extract the tab index from the command (go-to-tab-X)
    chrome.storage.local.get("markedTabs", (data) => {
      const storedTabs = data.markedTabs || [];
      if (storedTabs.length > index) {
        chrome.tabs.update(storedTabs[index].id, { active: true });
      }
    });
  }
});
