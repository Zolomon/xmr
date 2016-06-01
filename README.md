# XMR

This readme is a work in process.

## Notes

This project is being reworked, refactored, polished and cleaned.

## Requirements

1. Node.js
2. SQLite3
3.

## Install

```
git clone git@github.com:Zolomon/xmr.git xmr
cd xmr
npm install
node silo.js &
node backend.js &
```

# Import
```
The following structure is how the files should be placed.
It's very important that the date for the exam is formatted like below and that
images start from 0.png up to n.png

Tree structure:
$ tree public/images/courses/fake01
fake01
├── exams
│   └── 20111213
│       ├── 0.png
│       ├── 1.png
│       ├── 2.png
│       ├── 3.png
│       ├── 4.png
│       └── 5.png
└── solutions
    └── 20111213
        ├── 0.png
        ├── 1.png
        ├── 2.png
        ├── 3.png
        ├── 4.png
        └── 5.png
```
# TODO
* Feature to create example exam with questions
* Add prediction of tags for next exam
* [x] Add `Has Solution` flag and show in UI
* Add navbar and breadcrumb
* Add users, main feature is "I have solved this problem"
* Add navigation to next problem in exam, next problem in tag, and random next problem in exam (with solution?)
* Add GitHub connection and load in commits to news
