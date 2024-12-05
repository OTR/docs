import streamlit as st
from langchain_openai.chat_models import ChatOpenAI

st.set_page_config(
        page_title="Base of Bot",
)
st.title("🤖 Base of Bot")

openai_api_key = st.secrets["key"]


def generate_response(input_text):
    model = ChatOpenAI(
        model="gpt-4o",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        api_key=openai_api_key
    )
    resp = model.invoke(input_text)
    st.info(resp.content)


with st.form("my_form"):
    text = st.text_area(
        "Enter text:",
        "",
    )
    submitted = st.form_submit_button("Submit")
    if not openai_api_key.startswith("sk-"):
        st.warning("Please enter your OpenAI API key!", icon="⚠")
    if submitted and openai_api_key.startswith("sk-"):
        generate_response(text)
