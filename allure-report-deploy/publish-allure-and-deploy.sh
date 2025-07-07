#!/usr/bin/env bash

set -e

### --- Logging functions --- ###
print_error() { echo -e "\e[31mERROR: ${1}\e[m"; }
print_info() { echo -e "\e[36mINFO: ${1}\e[m"; }
skip() {
  print_info "No changes detected, skipping deployment"
  exit 0
}

### --- Prepare Allure Report with History --- ###
unset JAVA_HOME

mkdir -p "./${INPUT_GH_PAGES}"
mkdir -p "./${INPUT_ALLURE_HISTORY}"
cp -r "./${INPUT_GH_PAGES}/." "./${INPUT_ALLURE_HISTORY}"

REPOSITORY_NAME="${GITHUB_REPOSITORY##*/}"
GITHUB_PAGES_WEBSITE_URL="https://${INPUT_GITHUB_REPO_OWNER}.github.io/${REPOSITORY_NAME}"

COUNT=$(ls "./${INPUT_ALLURE_HISTORY}" | wc -l)
INPUT_KEEP_REPORTS=$((INPUT_KEEP_REPORTS + 1))
if (( COUNT > INPUT_KEEP_REPORTS )); then
  cd "./${INPUT_ALLURE_HISTORY}"
  rm -rvf index.html last-history
  ls | sort -n | grep -v 'CNAME' | head -n -$((INPUT_KEEP_REPORTS - 2)) | xargs rm -rvf
  cd "${GITHUB_WORKSPACE}"
fi

# Create index.html redirect
{
  echo "<!DOCTYPE html><meta charset=\"utf-8\">"
  echo "<meta http-equiv=\"refresh\" content=\"0; URL=${GITHUB_PAGES_WEBSITE_URL}/${INPUT_GITHUB_RUN_NUM}/index.html\">"
  echo "<meta http-equiv=\"Pragma\" content=\"no-cache\">"
  echo "<meta http-equiv=\"Expires\" content=\"0\">"
} > "./${INPUT_ALLURE_HISTORY}/index.html"

# Generate executor.json
[ -z "$INPUT_REPORT_NAME" ] && INPUT_REPORT_NAME="Allure Report with history"
cat <<EOF > executor.json
{
  "name": "GitHub Actions",
  "type": "github",
  "reportName": "${INPUT_REPORT_NAME}",
  "url": "${GITHUB_PAGES_WEBSITE_URL}",
  "reportUrl": "${GITHUB_PAGES_WEBSITE_URL}/${INPUT_GITHUB_RUN_NUM}/",
  "buildUrl": "${INPUT_GITHUB_SERVER_URL}/${INPUT_GITHUB_TESTS_REPO}/actions/runs/${INPUT_GITHUB_RUN_ID}",
  "buildName": "GitHub Actions Run #${INPUT_GITHUB_RUN_ID}",
  "buildOrder": "${INPUT_GITHUB_RUN_NUM}"
}
EOF
mv executor.json "./${INPUT_ALLURE_RESULTS}"

cp -r "./${INPUT_GH_PAGES}/last-history/." "./${INPUT_ALLURE_RESULTS}/history" || true

print_info "Generating Allure report..."
allure generate --clean "${INPUT_ALLURE_RESULTS}" -o "${INPUT_ALLURE_REPORT}"
cp -r "./${INPUT_ALLURE_REPORT}/." "./${INPUT_ALLURE_HISTORY}/${INPUT_GITHUB_RUN_NUM}"
cp -r "./${INPUT_ALLURE_REPORT}/history/." "./${INPUT_ALLURE_HISTORY}/last-history"

### --- GitHub Pages Deployment --- ###
print_info "Deploying to ${REPOSITORY_NAME}"

if [ -n "${PERSONAL_TOKEN}" ]; then
  print_info "Using PERSONAL_TOKEN"
  remote_repo="https://x-access-token:${PERSONAL_TOKEN}@github.com/${REPOSITORY_NAME}.git"

if [ -z "${PUBLISH_BRANCH}" ]; then
  print_error "Missing PUBLISH_BRANCH"
  exit 1
fi

if [ -z "${PUBLISH_DIR}" ]; then
  print_error "Missing PUBLISH_DIR"
  exit 1
fi

remote_branch="${PUBLISH_BRANCH}"
local_dir="${HOME}/ghpages_${RANDOM}"

if [[ "${INPUT_FORCEORPHAN}" == "true" ]]; then
  cd "${PUBLISH_DIR}"
  git init
  git checkout --orphan "${remote_branch}"
elif git clone --depth=1 --single-branch --branch "${remote_branch}" "${remote_repo}" "${local_dir}"; then
  cd "${local_dir}"
  [[ ${INPUT_KEEPFILES} != "true" ]] && git rm -r --ignore-unmatch '*'
  find "${GITHUB_WORKSPACE}/${PUBLISH_DIR}" -maxdepth 1 -not -name ".git" -not -name ".github" | tail -n +2 | xargs -I % cp -rf % "${local_dir}/"
else
  cd "${PUBLISH_DIR}"
  git init
  git checkout --orphan "${remote_branch}"
fi

git config user.name "${INPUT_USERNAME:-$GITHUB_ACTOR}"
git config user.email "${INPUT_USEREMAIL:-$GITHUB_ACTOR@users.noreply.github.com}"

git remote rm origin || true
git remote add origin "${remote_repo}"
git add --all

COMMIT_MSG="Automated deployment: $(date -u)"

git tag ${TAG_OPTS} -a "${COMMIT_MSG}" -m "${COMMIT_MSG}"
git push ${TAG_OPTS} origin "${COMMIT_MSG}"

print_info "✅ ${GITHUB_SHA} was successfully deployed to ${remote_repo}@${remote_branch}"
