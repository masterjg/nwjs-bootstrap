// @ts-ignore
import chrome from 'chrome';

let previousProcessorsInfo;

setInterval(async () => {
  await Promise.all([
    setCPUDataInDOM(),
    setMemoryDataInDOM(),
    setStorageDataInDOM()
  ]);
}, 1000);

async function setCPUDataInDOM () {
  const cpuInfo = await getCPUData();
  const currentProcessorsInfo = cpuInfo.processors;
  document.getElementById('cpu').innerHTML = `
    <h2>CPU</h2>
    <strong>Model:</strong> ${cpuInfo.modelName}<br/>
    <strong>Architecture:</strong> ${cpuInfo.archName}<br/>
    <strong>Features:</strong> ${cpuInfo.features.join(', ')}<br/>
    <strong>Processors:</strong> ${cpuInfo.numOfProcessors}<br/>
    <strong>Usage:</strong><br/>
    ${(() => {
    const cpuUsage = [];
    for (let processorId = 0; processorId < cpuInfo.numOfProcessors; processorId++) {
      const currentCPUData = currentProcessorsInfo[processorId].usage;
      const previousCPUData = previousProcessorsInfo ? previousProcessorsInfo[processorId].usage : { user: 0, kernel: 0, total: 0 };
      const cpuData = (currentCPUData.kernel + currentCPUData.user - previousCPUData.kernel - previousCPUData.user) / (currentCPUData.total - previousCPUData.total);
      const cpuDataPercentage = Math.floor(cpuData * 100);
      cpuUsage[processorId] = `<progress value="${cpuDataPercentage}" max="100"></progress>`;
    }
    return cpuUsage.join('<br/>');
  })()}<br/>
  `;
  previousProcessorsInfo = currentProcessorsInfo;
}

async function setMemoryDataInDOM () {
  const memoryInfo = await getMemoryData();
  document.getElementById('memory').innerHTML = `
    <h2>Memory</h2>
    <progress value="${memoryInfo.availableCapacity}" max="${memoryInfo.capacity}"></progress><br/>
  `;
}

async function setStorageDataInDOM () {
  const storageInfo = await getStorageData();
  document.getElementById('storage').innerHTML = `
    <h2>Storage</h2>
    ${storageInfo.map(storage => `[ ${storage.type} / ${storage.id} ] <strong>${storage.name}</strong> ${(storage.capacity * 1e-9).toFixed(2)} GB`).join('<br/>')}<br/>
  `;
}

async function getCPUData () {
  return new Promise((resolve) => {
    chrome.system.cpu.getInfo(resolve);
  });
}

async function getMemoryData () {
  return new Promise((resolve) => {
    chrome.system.memory.getInfo(resolve);
  });
}

async function getStorageData () {
  return new Promise((resolve) => {
    chrome.system.storage.getInfo(resolve);
  });
}
