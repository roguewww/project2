from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI
import logging

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO, 
                    format='%(asctime)s %(levelname)s %(message)s')

class DeepSeek(object):
    def __init__(self, user_prompt) -> None:
        # 这里进行设置，api和sys_prompt #
        self.api_key = 'sk-fea4c922920e47b2ae1f35f532bf9def'
        self.base_url = "https://api.deepseek.com"
        # 这里修改system prompt
        self.sys_prompt = "You are a helpful assistant"
        self.temperature = 1.25
        ################################
        self.user_prompt = user_prompt
        self.client = OpenAI(api_key=self.api_key, base_url=self.base_url)
        self.response = self.get_response()

    def get_response(self):
        response = self.client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": self.sys_prompt},
                {"role": "user", "content": self.user_prompt},
            ],
            stream=False,
            temperature=self.temperature)
        return response.choices[0].message.content

@app.route('/llm_api', methods=['POST'])
def taskflow():
    data = request.get_json()
    print(data)
    user_prompt = data.get("text", "")
    if not isinstance(user_prompt, str):
        return jsonify({'error': 'Invalid user_prompt format'}), 400
    logging.info(f'user: {user_prompt}')
    INST = DeepSeek(user_prompt)
    response = INST.response
    logging.info(f'llm: {response}')
    return jsonify({'llm': response})

if __name__ == '__main__':
    # http://127.0.0.1:8080
    app.run(debug=True, port=8080)
