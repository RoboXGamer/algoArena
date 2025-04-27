import axios from "axios";

// get judge0 language id
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

// submit batch
export const submitBatch = async (submissions) => {
  const { data } = await axios.post(
    `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
    { submissions }
  );
  console.log("submission Results : ", data);
  return data;
};

// sleep
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// poll batch
export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_API_URL}/submissions/batch`,
      {
        params: { tokens: tokens.join(","), base64_encoded: false },
      }
    );

    const results = data.submissions;
    const isAllDone = results.every(
      (result) => result.status.id !== 1 && result.status.id !== 2
    );
    if (isAllDone) {
      return results;
    }
    await sleep(1000);
  }
};
