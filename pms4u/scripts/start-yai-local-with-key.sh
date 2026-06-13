#!/usr/bin/env zsh
set -u

cd /Users/alaaatia/pms4u || exit 1

echo "PMS4U YAI Local launcher"
echo "Working directory: $(pwd)"
echo
echo "Paste your OPENAI_API_KEY below. It will not be shown or saved."
printf "OPENAI_API_KEY: "
stty -echo
IFS= read -r OPENAI_API_KEY
stty echo
echo

OPENAI_API_KEY="${OPENAI_API_KEY#"${OPENAI_API_KEY%%[![:space:]]*}"}"
OPENAI_API_KEY="${OPENAI_API_KEY%"${OPENAI_API_KEY##*[![:space:]]}"}"

if [[ -z "${OPENAI_API_KEY}" ]]; then
  echo "No key entered. Nothing was started."
  echo "Press Enter to close this window."
  read -r _
  exit 1
fi

if [[ "${OPENAI_API_KEY}" != sk-* ]]; then
  echo "The entered value does not look like an OpenAI API key."
  echo "Expected it to start with: sk-"
  echo "Press Enter to close this window."
  read -r _
  exit 1
fi

export OPENAI_API_KEY
echo "Key received for this Terminal process only. Length: ${#OPENAI_API_KEY} characters."
echo
echo "Starting Next dev server..."
echo "When ready, open: http://127.0.0.1:3000/yai"
echo
existing_pid="$(lsof -tiTCP:3000 -sTCP:LISTEN 2>/dev/null | head -n 1 || true)"
if [[ -n "${existing_pid}" ]]; then
  echo "Port 3000 is already in use by process ${existing_pid}."
  printf "Stop that old local dev server and start this one? [y/N] "
  read -r stop_old
  if [[ "${stop_old:l}" == "y" || "${stop_old:l}" == "yes" ]]; then
    kill "${existing_pid}"
    sleep 2
  else
    echo "Leaving the old server running. Nothing new was started."
    echo "Press Enter to close this window."
    read -r _
    exit 1
  fi
fi
echo

npm run dev

echo
echo "Server stopped. Press Enter to close this window."
read -r _
