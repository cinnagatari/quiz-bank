import storage from "electron-json-storage";
import axios from "axios";

const ls = {
    getTags: async function() {
        let promise = new Promise((resolve, reject) => {
            storage.get("tags", (err, tags) => {
                if (Object.keys(tags).length > 0 && tags["tags"]) {
                    resolve(tags);
                } else
                    storage.get("userdata", (err, data) => {
                        axios({
                            method: "get",
                            url:
                                "https://api.irvinecode.net/api/v1/codequizTag",
                            headers: {
                                Authorization: `Bearer ${data.token}`
                            }
                        })
                            .then(res => {
                                console.log(res);
                                let TAGS = res.data;
                                let sections = [];
                                TAGS.forEach(tag => {
                                    let title = tag.name;
                                    title = title
                                        .split("")
                                        .reverse()
                                        .join();
                                    let index = title.indexOf("-");
                                    let section = tag.name.substring(
                                        0,
                                        tag.name.length - index
                                    );
                                    let found = false;
                                    sections.forEach(s => {
                                        if (s.section === section) {
                                            s.tags.push(tag);
                                            found = true;
                                        }
                                    });
                                    if (!found)
                                        sections.push({
                                            section: section,
                                            tags: [tag]
                                        });
                                });
                                tags["tags"] = sections;
                                storage.set("tags", tags, err => {});
                                resolve(tags);
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    });
            });
        });

        let result = await promise;
        return result;
    },

    setTags: function(id) {
        storage.get("tag-" + id, (err, tag) => {
            let cnt = 0;
            let progress = 0;
            Object.keys(tag).forEach(t => {
                if (t !== "quizzes" && tag[t]) cnt++;
            });
            if (tag["quizzes"]) progress = (cnt / tag["quizzes"].length) * 100;
            storage.get("tags", (err, data) => {
                if (Object.keys(data).length > 0) {
                    data["tag-" + id] = progress;
                    storage.set("tags", data, err => {});
                } else storage.set("tags", { ["tag-" + id]: progress });
            });
        });
    },

    getTag: async function(tag) {
        let key = "tag-" + tag;
        let promise = new Promise((resolve, reject) => {
            storage.get(key, (err, data) => {
                if (Object.keys(data).length > 0 && data["quizzes"])
                    resolve(data);
                else {
                    storage.get("userdata", (err, user) => {
                        axios({
                            url: `http://api.irvinecode.net/api/v1/codequiz?tag=${tag}`,
                            method: "get",
                            headers: {
                                Authorization: `Bearer ${user.token}`
                            }
                        })
                            .then(res => {
                                console.log(res);
                                data["quizzes"] = res.data;
                                storage.set(key, data, err => {});
                                resolve(data);
                            })
                            .catch(err => {
                                resolve(data);
                            });
                    });
                }
            });
        });

        let result = await promise;

        return result;
    },

    setTag: function(tag, quiz, correct, total) {
        let id = tag;
        tag = "tag-" + tag;
        quiz = "quiz-" + quiz;

        storage.get(tag, (err, data) => {
            if (Object.keys(data).length > 0) {
                data[quiz] = correct === total;
                storage.set(tag, data, err => {
                    if (correct === total) this.setTags(id);
                });
            } else
                storage.set(
                    tag,
                    {
                        [quiz]: correct === total
                    },
                    err => {
                        if (correct === total) this.setTags(id);
                    }
                );
        });
    },

    getQuiz: async function(quiz) {
        let ret = {
            q: -1,
            s: -1
        };
        let id = quiz;
        quiz = "quiz-" + quiz;
        let promise = new Promise((resolve, reject) => {
            storage.get(quiz, (err, question) => {
                if (question["submission"]) ret.s = question["submission"];
                if (question["question"]) {
                    ret.q = question["question"];
                    resolve(ret);
                } else
                    storage.get("userdata", (err, data) => {
                        axios({
                            url: `http://api.irvinecode.net/api/v1/codequiz/${id}`,
                            method: "get",
                            headers: {
                                Authorization: `Bearer ${data.token}`
                            }
                        })
                            .then(res => {
                                console.log(res);
                                question["question"] = res.data;
                                ret.q = res.data;
                                storage.set(quiz, question, err => {});
                                resolve(ret);
                            })
                            .catch(err => {
                                resolve(ret);
                            });
                    });
            });
        });
        let result = await promise;
        return result;
    },

    submitQuiz: function(quiz, tag, correct, total, source, mode, question) {
        let id = quiz;
        quiz = "quiz-" + quiz;
        storage.get(quiz, (err, question) => {
            if (
                typeof question["submission"] === "undefined" ||
                question["submission"].correct < correct
            ) {
                storage.get("userdata", (err, data) => {
                    let body = {
                        user_id: data.uid,
                        quiz_id: id,
                        pt: correct,
                        pt_outof: total,
                        code: source,
                        type: mode
                    };
                    axios({
                        url: `http://api.irvinecode.net/api/v1/codequizrecords/me`,
                        method: "post",
                        headers: {
                            Authorization: `Bearer ${data.token}`
                        },
                        data: body
                    })
                        .then(res => {
                            console.log(res);
                        })
                        .catch(err => {});
                });
                question["submission"] = {
                    source,
                    total,
                    correct
                };
                storage.set(quiz, question, err => {});
                this.setTag(tag, id, correct, total);
                this.addRecent(question, correct, total);
                if (correct === total) this.setProgressToday();
            }
        });
    },

    getLastQuestion: async function() {
        let promise = new Promise((resolve, reject) => {
            storage.get("last-question", (err, data) => {
                resolve(data);
            });
        });
        let result = await promise;
        return result;
    },

    setLastQuestion: function(question) {
        storage.set("last-question", question, err => {});
    },

    getRecent: async function() {
        let promise = new Promise((resolve, reject) => {
            storage.get("recent-submissions", (err, data) => {
                resolve(data);
            });
        });
        let result = await promise;
        return result;
    },

    addRecent: function(question, correct, total) {
        storage.get("recent-submissions", (err, data) => {



            let submission = {
                question,
                progress: (correct / total) * 100,
                time: new Date().toLocaleString()
            };
            if (Object.keys(data).length > 0) {
                data.submissions.unshift(submission);
                if (data.submissions.length > 10) data.pop();
            } else data.submissions = [submission];

            storage.set("recent-submissions", data, err => {});
        });
    },

    getProgressToday: async function() {
        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth();
        let year = d.getFullYear();
        let progress = {
            day,
            month,
            year,
            completed: 0
        };
        let promise = new Promise((resolve, reject) => {
            storage.get("progress-today", (err, data) => {
                if (Object.keys(data).length > 0) {
                    if (
                        data.day === day &&
                        data.month === month &&
                        data.year === year
                    )
                        resolve(data);
                } else {
                    resolve(progress);
                }
            });
        });
        let result = await promise;
        return result;
    },

    setProgressToday: function() {
        let d = new Date();
        let day = d.getDate();
        let month = d.getMonth();
        let year = d.getFullYear();
        let progress = {
            day,
            month,
            year,
            completed: 1
        };
        storage.get("progress-today", (err, data) => {
            if (Object.keys(data).length > 0) {
                if (
                    data.day === day &&
                    data.month === month &&
                    data.year === year
                ) {
                    data.completed++;
                    progress = { ...data };
                }
            }
            storage.set("progress-today", progress, err => {});
        });
    }
};

export default ls;
