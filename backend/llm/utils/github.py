import requests
import base64


def create_github_repo(username, token, repo_name, html_content, css_content, js_content, commit_message):
    headers = {
        "Authorization": f"token {token}"
    }

    # Create the repository (private repo)
    repo_data = {
        "name": repo_name,
        "auto_init": True,
        "private": True,  # Set to True to create a private repository
        "default_branch": "main"  # Set the default branch explicitly to "main"
    }
    response = requests.post(f"https://api.github.com/user/repos", json=repo_data, headers=headers)
    if response.status_code != 201:
        print("Failed to create the repository.")
        return None

    # Add files to the repository
    base_url = f"https://api.github.com/repos/{username}/{repo_name}/contents"
    files_data = [
        {"name": "index.html", "content": html_content},
        {"name": "styles.css", "content": css_content},
        {"name": "scripts.js", "content": js_content},
    ]
    for file_data in files_data:
        file_content = base64.b64encode(file_data["content"].encode()).decode()
        file_name = file_data["name"]
        file_payload = {
            "message": f"Add {file_name}: {commit_message}",
            "content": file_content,
            "branch": "main"  # Add files to the main branch
        }
        response = requests.put(f"{base_url}/{file_name}", json=file_payload, headers=headers)
        if response.status_code != 201:
            print(f"Failed to add {file_name} to the repository.")
            return None

    pages_settings_payload = {
        "source": {
            "branch": "main",
            "path": "/"
        }
    }
    response = requests.post(f"https://api.github.com/repos/{username}/{repo_name}/pages", json=pages_settings_payload, headers=headers)
    if response.status_code != 201:
        print("Failed to enable GitHub Pages.")
        return None

    return f"https://{username}.github.io/{repo_name}"


def update_github_repo(username, token, repo_name, new_html_content, new_css_content, new_js_content, commit_message):
    headers = {
        "Authorization": f"token {token}"
    }

    # Fetch the existing files from the repository
    base_url = f"https://api.github.com/repos/{username}/{repo_name}/contents"
    files_to_update = ["index.html", "styles.css", "scripts.js"]
    existing_files = {}
    for file_name in files_to_update:
        response = requests.get(f"{base_url}/{file_name}", headers=headers)
        if response.status_code == 200:
            existing_files[file_name] = response.json()

    # Update the contents of the files
    for file_name in existing_files:
        file_content = base64.b64decode(existing_files[file_name]["content"]).decode()
        if file_name == "index.html":
            file_content = new_html_content
        elif file_name == "styles.css":
            file_content = new_css_content
        elif file_name == "scripts.js":
            file_content = new_js_content

        file_content_encoded = base64.b64encode(file_content.encode()).decode()
        file_payload = {
            "message": f"Update {file_name} : {commit_message}",
            "content": file_content_encoded,
            "branch": "main",
            "sha": existing_files[file_name]["sha"]
        }
        response = requests.put(f"{base_url}/{file_name}", json=file_payload, headers=headers)
        if response.status_code != 200:
            print(f"Failed to update {file_name}.")
            return None

    return f"https://{username}.github.io/{repo_name}"


def delete_github_repo(username, repo_id, token):
    headers = {
        "Authorization": f"token {token}"
    }

    # Make a DELETE request to the GitHub API to delete the repository
    api_url = f"https://api.github.com/repos/{username}/{repo_id}"
    response = requests.delete(api_url, headers=headers)

    if response.status_code == 204:
        print(f"Repository '{repo_id}' has been successfully deleted.")
        return True
    else:
        print(f"Failed to delete the repository '{repo_id}'.")
        return False


def check_deployment_status(username, repo_id, token):
    headers = {
        "Authorization": f"token {token}"
    }

    # Make a request to the GitHub API to get the repository information
    api_url = f"https://api.github.com/repos/{username}/{repo_id}/pages"
    response = requests.get(api_url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        status = data.get("status", "")

        if status == "built":
            status_msg = "Deployment is successful and the page is live"
        else:
            status_msg = "Deployment is in progress"
    elif response.status_code == 404:
        status_msg = "GitHub Pages not enabled for this repository"
    else:
        status_msg = "Failed to retrieve deployment status"

    return status_msg


__all__ = [
    "create_github_repo",
    "update_github_repo",
    "delete_github_repo",
    "check_deployment_status"

]
