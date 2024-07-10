from flask import Flask, jsonify, request
from openai import OpenAI

app = Flask(__name__)

class DeepSeek(object):
    def __init__(self, user_prompt) -> None:
        # 这里进行设置，api和sys_prompt #
        self.api_key = '<api_key>'
        self.base_url = "https://api.deepseek.com"
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
            stream = False,
            temperature = self.temperature
        )
        return response.choices[0].message.content

@app.route('/llm_api', methods=['POST'])
def taskflow():
    data = request.get_json()
    # need to parse request json here
    INST = DeepSeek(data)
    return jsonify({'llm': INST.response})

if __name__ == '__main__':
    # http://127.0.0.1:8080
    app.run(debug=True, port=8080)