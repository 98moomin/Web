const URL = "http://localhost:9999";
$(document).ready(async function () {
  let name;
  let id;
  await $.ajax({
    url: `${URL}/whois`,
    method: "POST",
    success: function (res) {
      name = res.name;
      id = res.id;
    },
  });

  await $.ajax({
    url: `${URL}/getSubject`,
    method: "POST",
    data: {
      id: id,
    },
    success: function (res) {
      let subjects = res.subjects;
      if (subjects.length != 0) {
        let table = document.createElement("table");
        table.setAttribute("id", "table");
        let tmptr = document.createElement("tr");
        let tmptd = document.createElement("td");
        let tmp = document.createTextNode("번호");
        tmptd.appendChild(tmp);
        tmptr.appendChild(tmptd);
        tmptd = document.createElement("td");
        tmp = document.createTextNode("과목");
        tmptd.appendChild(tmp);
        tmptr.appendChild(tmptd);
        tmptd = document.createElement("td");
        tmp = document.createTextNode("시간");
        tmptd.appendChild(tmp);
        tmptr.appendChild(tmptd);
        table.appendChild(tmptr);
        for (let item of subjects) {
          let tr = document.createElement("tr");
          tr.setAttribute("name", subjects.indexOf(item));
          let indextd = document.createElement("td");
          let subjecttd = document.createElement("td");
          let timetd = document.createElement("td");
          let index = document.createTextNode(subjects.indexOf(item));
          let sub = document.createTextNode(item.subject);
          let time = document.createTextNode(item.time);
          indextd.append(index);
          subjecttd.appendChild(sub);
          timetd.appendChild(time);
          tr.appendChild(indextd);
          tr.appendChild(subjecttd);
          tr.appendChild(timetd);
          table.appendChild(tr);
        }
        $(".subjectCont").append(table);
      } else {
        let h2 = document.createElement("h2");
        let t = document.createTextNode("신청하신 과목이 없습니다.");
        h2.appendChild(t);
        $(".subjectCont").append(h2);
      }
    },
  });

  $("#reloadBtn").on("click", async function () {
    let cont = document.getElementsByClassName("subjectCont")[0];
    while (cont.firstChild) {
      cont.removeChild(cont.firstChild);
    }
    await $.ajax({
      url: `${URL}/getSubject`,
      method: "POST",
      data: {
        id: id,
      },
      success: function (res) {
        let subjects = res.subjects;
        if (subjects.length != 0) {
          let table = document.createElement("table");
          table.setAttribute("id", "table");
          let tmptr = document.createElement("tr");
          let tmptd = document.createElement("td");
          let tmp = document.createTextNode("번호");
          tmptd.appendChild(tmp);
          tmptr.appendChild(tmptd);
          tmptd = document.createElement("td");
          tmp = document.createTextNode("과목");
          tmptd.appendChild(tmp);
          tmptr.appendChild(tmptd);
          tmptd = document.createElement("td");
          tmp = document.createTextNode("시간");
          tmptd.appendChild(tmp);
          tmptr.appendChild(tmptd);
          table.appendChild(tmptr);
          for (let item of subjects) {
            let tr = document.createElement("tr");
            tr.setAttribute("name", subjects.indexOf(item));
            let indextd = document.createElement("td");
            let subjecttd = document.createElement("td");
            let timetd = document.createElement("td");
            let index = document.createTextNode(subjects.indexOf(item));
            let sub = document.createTextNode(item.subject);
            let time = document.createTextNode(item.time);
            indextd.append(index);
            subjecttd.appendChild(sub);
            timetd.appendChild(time);
            tr.appendChild(indextd);
            tr.appendChild(subjecttd);
            tr.appendChild(timetd);
            table.appendChild(tr);
          }
          $(".subjectCont").append(table);
        } else {
          let h2 = document.createElement("h2");
          let t = document.createTextNode("신청하신 과목이 없습니다.");
          h2.appendChild(t);
          $(".subjectCont").append(h2);
        }
      },
    });
  });
});
