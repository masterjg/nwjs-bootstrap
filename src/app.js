// @ts-ignore
import chrome from 'chrome';

setInterval(async () => {
  const [ cpuInfo ] = await Promise.all([
    await getCPUInfo()
  ]);
  await setSystemInfoInDom(cpuInfo);
}, 1000);

async function getCPUInfo() {
  return new Promise((resolve) => {
    chrome.system.cpu.getInfo(resolve);
  });
}

let previousProcessorsInfo;

async function setSystemInfoInDom(cpuInfo) {
  const currentProcessorsInfo = cpuInfo.processors;
  document.getElementById("app").innerHTML = `
  <h1>System summary</h1>
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