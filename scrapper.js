const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const webdriver = require('selenium-webdriver');
const { elementsLocated, elementIsEnabled } = require('selenium-webdriver/lib/until');

let driver = new webdriver.Builder()
    .forBrowser(webdriver.Browser.FIREFOX)
    .build();

async function getVotesForKathmandu() {
  // let driver = await new Builder().forBrowser(Browser.FIREFOX).build();
  let datas = []; 
  try {
    await driver.get('https://localelection.ekantipur.com/pradesh-3/district-kathmandu?lng=eng');
    await driver.sleep(1000);

    const iframeElements = await driver.wait(until.elementsLocated(By.css('iframe')), 10000);
    if(iframeElements.length){
      await driver.executeScript(`
      let elems = document.getElementsByTagName("iframe"); 
      for(let i = elems.length-1; i >= 0; i--) {
        elems[i].remove();
      }
      elems = document.getElementsByTagName("ins"); 
      for(let i = elems.length-1; i >= 0; i--) {
        elems[i].remove();
      }      
      `);
    }

    const elements = await driver.wait(until.elementsLocated(By.className('accordion-title')), 10000);
    const size = elements.length;

    for(let i = 1; i < 2; i++){
      await driver.executeScript('arguments[0].scrollIntoView(true);', elements[i]);
      await driver.sleep(500);
      await driver.executeScript('window.scrollBy(0, -window.innerHeight / 4);');      
      await driver.sleep(500);      
      elements[i].click();

      await driver.sleep(500);
      
      let parent = await driver.executeScript('return arguments[0].parentNode;', elements[i]);
      let grandParent = await driver.executeScript('return arguments[0].parentNode;', parent);      
      let accordionElement = await driver.executeScript('return arguments[0].parentNode', grandParent);

      // wait until elementsLocated with className 'candidate-name'      
      const candidateNames = await driver.wait(until.elementsLocated(By.className('candidate-name')), 10000);
      const voteNumbers = await driver.wait(until.elementsLocated(By.className('vote-numbers')), 10000);
      const candidateImages = await driver.wait(until.elementsLocated(By.className('candidate-img')), 10000);

      datas.push({
        'name': await parent.getText(),
        'candidateNames': await Promise.all(candidateNames.map(async (candidateName) => {
          return await candidateName.getText();
        })),
        'voteNumbers': await Promise.all(voteNumbers.map(async (voteNumber) => { 
          return await voteNumber.getText();
        })), 
        candidateImages: await Promise.all(candidateImages.map(async (candidateImage) => {
          // get child of candidateImage
          let child = await driver.executeScript('return arguments[0].childNodes[0];', candidateImage);
          return await child.getAttribute('src');
        })),
      });

      // delete accordion element
      await driver.executeScript('arguments[0].remove();', accordionElement);
      await driver.sleep(100);
    }
  
    // console.log(datas);
    
    return datas;
  } catch (e) { 
    console.log(e.message);
    return [];
  } finally {
    console.log("finished fetching data!");
    // await driver.quit();
  }
}

module.exports = { getVotesForKathmandu };
