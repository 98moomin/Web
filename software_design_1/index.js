const URL = "http://localhost:9999";
$(document).ready(function () {
  $.ajax({
    url: `${URL}/logoutAll`,
    method: "GET",
    success: function (res) {},
  });

  $(".tabs .tab").on("click", function () {
    if ($(this).hasClass("signIn")) {
      $(".tabs .tab").removeClass("active");
      $(this).addClass("active");
      $(".confirmCont").show();
      $(".signUpCont").hide();
    }
    if ($(this).hasClass("signUp")) {
      $(".tabs .tab").removeClass("active");
      $(this).addClass("active");
      $(".signUpCont").show();
      $(".confirmCont").hide();
    }
  });

  $("#signInBtn").on("click", function () {
    let check = true;
    let id = $("#id").val();
    let pw = $("#pw").val();
    if (id == "") {
      alert("ID를 입력해주세요");
      check = false;
    }
    if (pw == "") {
      alert("PASSWORD를 입력해주세요");
      check = false;
    }
    if (check) {
      $.ajax({
        url: `${URL}/signIn`,
        method: "POST",
        data: {
          id: id,
          pw: pw,
        },
        success: async function (res) {
          if (res.code == "200") {
            let name = res.name;
            let id = res.id;
            $(".signCont").fadeOut(300);
            setTimeout(function () {
              $(".enrollCont").fadeIn(600);
              let tmp = document.createElement("h3");
              tmp.setAttribute("id", "userName");
              tmp.innerText = `${name}님 환영합니다.`;
              tmp.setAttribute("name", id);
              tmp.setAttribute("class", "userInfo");
              $(".userInfoCont").prepend(tmp);
            }, 300);
            let child = window.open("enroll.html", "popup", "width = 10, hegith = 10");
            child.resizeTo(500, 700);
            child.moveTo(1350, 0);
          } else if (res.code == "300") {
            alert(`${res.id}는 존재하지 않는 ID입니다.`);
          } else if (res.code == "301") {
            alert(`${res.id}의 비밀번호가 틀렸습니다.`);
          }
        },
        error: function () {
          alert("서버 연결 상태가 원할하지 않습니다.");
        },
      });
    }
  });

  $("#signUpBtn").on("click", function () {
    let check = true;
    let name = $("#newName").val();
    let id = $("#newId").val();
    let pw = $("#newPw").val();
    if (name == "") {
      alert("이름이 빈칸일수는 없습니다.");
      check = false;
    }
    if (id == "") {
      alert("ID를 입력해주세요");
      check = false;
    }
    if (pw == "") {
      alert("PASSWORD를 입력해주세요");
      check = false;
    }
    if (check) {
      $.ajax({
        url: `${URL}/signUp`,
        method: "POST",
        data: {
          name: name,
          id: id,
          pw: pw,
          login: false,
          sugang: [],
        },
        success: async function (res) {
          if (res == "200") {
            alert(`${name}님 ID:${id}\n회원가입이 완료되었습니다.`);
            $(".signIn").click();
          } else if (res == "302") {
            alert("이미 존재하는 ID입니다.");
          }
        },
        error: function () {
          alert("서버 연결 상태가 원할하지 않습니다.");
        },
      });
    }
  });

  $("#selectYear").on("change", function (e) {
    let first = [
      "C프로그래밍",
      "C++프로그래밍",
      "물리I",
      "물리II",
      "화학",
      "디지털정보활용",
      "대학수학",
      "선형대수학",
    ];
    let second = [
      "데이터구조",
      "프로그래밍설계",
      "JAVA프로그래밍",
      "웹프로그래밍",
      "컴퓨터구조",
      "파일처리론",
    ];
    let third = [
      "컴퓨터네트워크",
      "수치해석",
      "소프트웨어설게및실습I",
      "데이터베이스",
      "운영체제",
      "프로그래밍언어론",
    ];
    let fourth = [
      "논문보고서작성및발표기법",
      "문제해결기법",
      "미국에서살아남기",
      "소프트웨어프로젝트I",
      "인공지능",
      "컴퓨터그래픽스",
    ];
    let select = $("#selectYear option:selected").val();
    let tmp;
    if (select == "1st") tmp = first;
    else if (select == "2nd") tmp = second;
    else if (select == "3rd") tmp = third;
    else if (select == "4th") tmp = fourth;

    let len = $("#selectSubject option");
    len.each(function (index, item) {
      if (index != 0) {
        item.remove();
      }
    });
    for (let item of tmp) {
      let opt = document.createElement("option");
      opt.value = item;
      opt.innerHTML = item;
      $("#selectSubject").append(opt);
    }
  });

  $("#applyBtn").on("click", function () {
    let subject = $("#selectSubject option:selected").val();
    if (subject == "") {
      alert("과목을 선택하여 주세요.");
    } else {
      let time = $("#subjectTime").val();
      let id = $("#userName").attr("name");
      $.ajax({
        url: `${URL}/enroll`,
        method: "POST",
        data: {
          id: id,
          subject: subject,
          time: time,
        },
        success: async function (res) {
          let name = res.name;
          let id = res.id;
          let subject = res.subject;
          let time = res.time;
          if (res.code == "200") alert(`${name}님 ${subject}(${time})\n수강신청 완료되었습니다.`);
          else if (res.code == "303") alert(`${subject}은(는) 이미 신청되어있는 과목입니다.`);
        },
        error: function () {
          alert("서버 연결 상태가 원할하지 않습니다.");
        },
      });
    }
  });

  $("#logoutBtn").on("click", function () {
    let id = $("#userName").attr("name");
    $.ajax({
      url: `${URL}/logout`,
      method: "POST",
      data: {
        id: id,
      },
      success: async function (res) {
        if (res.code == "200") {
          $(".enrollCont").fadeOut(300);
          setTimeout(function () {
            $(".signCont").fadeIn(600);
            $("#userName").remove();
          }, 300);
        }
      },
    });
  });

  $("#checkScheduleBtn").on("click", function () {
    let child = window.open("enroll.html", "popup", "width = 10, hegith = 10");
    child.resizeTo(500, 700);
    child.moveTo(1350, 0);
  });
});
