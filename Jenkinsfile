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
}