from openai import OpenAI
client = OpenAI(
    base_url="https://rayedchow--example-vllm-openai-compatible-serve.modal.run/v1",
	api_key="super-secret-key",
)

completion = client.chat.completions.create(
    model="charlesfrye/Ministral-8B-Instruct-2410-FP8-Dynamic",
    messages=[
        {"role": "system", "content": "You are a helpful assistant that gets the connotation of the message." },
        {"role": "user", "content": "Hello!"}
    ],
    extra_body={"guided_choice": ["positive", "negative"]},
)
print(completion.choices[0].message.content)