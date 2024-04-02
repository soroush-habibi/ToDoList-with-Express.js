pipeline {
  agent any
  stages {
    stage('pull') {
      steps {
        git(url: 'https://github.com/soroush-habibi/ToDoList-with-Express.js', branch: 'master')
      }
    }

    stage('log') {
      steps {
        sh 'ls -lh'
      }
    }

  }
  post {
    failure {
        mail to: 'sshhsiteariair@gmail.com',
             subject: "Failed Pipeline",
             body: "Something is wrong"
    }
  }
}