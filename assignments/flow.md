## Project flow

### Authentication
  - accept all data required data form the user
  - validate the data 
  - create the user in the db.

### Execution of created problem solution submit by user
  - Only admin can create problems
  - User can view all problems and solve them
  - When user solve a problem first check code is execute correctly then after get all all response now create a submission
  - submission is create every time now all test case true or some test false if false then store compile output has some error
  - and add test case every time with the submissionId okk.
  - but only one time we add the problemSolved only first time.

  
### Problem creation by the ADMIN only
  - accept the all required data that is compulsory
  - loop all the ref solution with the attached programming language.
  - this particular ref solution run for all test cases ok.
  - and if all language solution passed for this problem.
  - then create it problem in the db.