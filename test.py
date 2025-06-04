import subprocess

def get_git_user_email():
  try:
    email = subprocess.check_output(['git', 'config', 'user.email']).decode('utf-8').strip()
    return email
  except subprocess.CalledProcessError:
    return None

def get_git_user_name():
  try:
    name = subprocess.check_output(['git', 'config', 'user.name']).decode('utf-8').strip()
    return name
  except subprocess.CalledProcessError:
    return None

def set_git_user_email(email):
  try:
    subprocess.check_call(['git', 'config', 'user.email', email])
    return True
  except subprocess.CalledProcessError:
    return False

def set_git_user_name(name):
  try:
    subprocess.check_call(['git', 'config', 'user.name', name])
    return True
  except subprocess.CalledProcessError:
    return False

if __name__ == '__main__':
  while True:
    print("\nOptions:")
    print("1. Set Git User to RoboXGamer")
    print("2. Set Git User to Kunal")
    print("3. Set Git User to Custom")
    print("4. Show Current Git User")
    print("5. Exit")

    choice = input("Enter your choice: ")

    if choice == '1':
      if set_git_user_email("roboxgamer52@gmail.com") and set_git_user_name("RoboXGamer"):
        print("Git user info updated to RoboXGamer successfully.")
      else:
        print("Failed to update Git user info.")

    elif choice == '2':
      if set_git_user_email("kunal34255@gmail.com") and set_git_user_name("KUNAL01011"):
        print("Git user info updated to Kunal successfully.")
      else:
        print("Failed to update Git user info.")

    elif choice == '3':
      new_email = input("Enter new Git user email: ")
      new_name = input("Enter new Git user name: ")

      if set_git_user_email(new_email) and set_git_user_name(new_name):
        print("Git user info updated successfully.")
      else:
        print("Failed to update Git user info.")
    
    elif choice == '4':
        current_email = get_git_user_email()
        current_name = get_git_user_name()
        if current_email and current_name:
            print(f"Current Git user: Name - {current_name}, Email - {current_email}")
        else:
            print("Could not retrieve current Git user information.")

    elif choice == '5':
      break
    else:
      print("Invalid choice. Please try again.")
