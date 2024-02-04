const BASE_URL = 'http://192.168.1.9:11434/api';

const fetchAutocomplete = async (text) => {
  const response = await fetch(`${BASE_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "mistral",
      prompt: `Complete the given sentence: ${text}`,
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 30,
        stop: ["\n", "#", "「"],
      },
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
};

export { fetchAutocomplete };
