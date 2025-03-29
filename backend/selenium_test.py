from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
import json
import time

# Connect to running Arc instance
chrome_options = webdriver.ChromeOptions()
chrome_options.debugger_address = "127.0.0.1:9222"
driver = webdriver.Chrome(options=chrome_options)

# Wait to ensure all tabs load
time.sleep(2)

# Find Messenger tab by title or URL
messenger_tab = None
print(driver.window_handles)
for handle in driver.window_handles:
	driver.switch_to.window(handle)
	print(driver.title)
	if "Facebook" in driver.title or "messenger.com" in driver.current_url:
		messenger_tab = handle
		break

# If Messenger tab is found, switch to it
if messenger_tab:
	driver.switch_to.window(messenger_tab)
else:
	print("Messenger tab not found!")
	driver.quit()
	exit()

# Now, extract messages from the correct tab
# messages = driver.find_elements(By.CSS_SELECTOR, 'div[dir="auto"]')

def extract_messages(driver, html):
	soup = BeautifulSoup(html, 'html.parser')
	messages = driver.find_elements(By.XPATH, "//div[@dir='auto']")  # Extract message elements
	
	chat_data = []
	
	for message in messages:
		try:
			content = message.text.strip()
			if not content:
				continue  # Skip empty messages
			
			sender_html = message.get_attribute("outerHTML")  # Store full HTML of the message div
			
			chat_data.append({"sender": sender_html, "message": content})
		
		except Exception as e:
			pass  # Skip any errors
	
	# Determine sender identity based on class comparison
	if chat_data:
		first_class = BeautifulSoup(chat_data[0]['sender'], 'html.parser').div.get('class', [])
		
		for item in chat_data:
			item_classes = BeautifulSoup(item['sender'], 'html.parser').div.get('class', [])
			item["sender"] = "me" if item_classes == first_class else "receiver"
	
	return chat_data

def send_message(driver, message_text):
	try:
		# Find the message input box (Messenger chatbox)
		chatbox = driver.find_element(By.CSS_SELECTOR, 'div[contenteditable="true"][role="textbox"]')
		
		# Click the chatbox to focus (optional but helps ensure input works)
		chatbox.click()
		
		# Type the message
		chatbox.send_keys(message_text)
		time.sleep(1)  # Allow time for input
		
		# Press Enter to send the message
		chatbox.send_keys(Keys.RETURN)
		print(f"Sent: {message_text}")

	except Exception as e:
		print("Error sending message:", str(e))

# Print JSON output
# json_output = json.dumps(chat_data, indent=4, ensure_ascii=False)
# print(json_output)
chat_data = extract_messages(driver, driver.page_source)
print(chat_data)
# send_message(driver, "Hello?")