// By Rashad
$(document).ready(function () {
  function init() {
    var operation = getParameterValues("operation");
    var pid = getParameterValues("pid");
    // check if the operations is set
    if (operation != undefined) {
      const files = [
        "p1.json",
        "p2.json",
        "p3.json",
        "p4.json",
        "p5.json",
        "p6.json",
        "p7.json",
        "p8.json",
        "p9.json",
        "p10.json",
        "p11.json",
        "p12.json",
        "p13.json",
        "p14.json",
      ];
      $.each(files, function (index, value) {
        file = "gestures/" + value;
        $.getJSON(file, function (data) {
          proposals = data.proposals;
          $.each(proposals, function (index, value) {
            if (operation == value.operation) {
              pid = "<div class='col-md-1'><b>P" + data.id + "</b></div>";
              desc =
                "<div class='col-md-4'><b>Example:</b> " +
                value.example +
                "<br><b>Gesture:</b> " +
                value.gesture +
                "<br><b>Reasons:</b> " +
                value.reasons +
                "</div>";
              notes =
                "<div class='col-md-3'><b>Notes:</b> " +
                value.notes +
                "<br><b>Evaluation:</b> " +
                value.Evaluation[0] +
                ", " +
                value.Evaluation[1] +
                ", " +
                value.Evaluation[2] +
                "<br><b>CAT experience:</b> " +
                data.experience +
                "<br><b>Age:</b> " +
                data.age +
                "<br><b>Gender:</b> " +
                data.gender +
                "</div>";
              video =
                "<div class='col-md-2'><div class='row'><div class='col-md-12'><video loop autoplay muted width='320' height='160'><source src='vids/p" +
                data.id +
                "-" +
                value.order +
                ".mp4' type='video/mp4'></video></div></div></div>";
              $(".content").append(
                '<div class="row m-4">' + pid + desc + notes + video + "</div>"
              );
              $("#title").html("<< " + value.operation + " >>");
            }
          });
        }).fail(function () {
          console.log("An error has occurred.");
        });
      });
      //populate clusters
      setTimeout(function () {
        getClusters(operation);
      }, 2000);
    }
    //case pid
    else if (pid != undefined) {
      var file = "gestures/p" + pid + ".json";
      $.getJSON(file, function (data) {
        proposals = data.proposals;
        $.each(proposals, function (index, value) {
          order =
            "<div class='col-md-2'><b>" +
            value.order +
            ". " +
            value.operation +
            "</b></div>";
          desc =
            "<div class='col-md-4'><b>Example:</b> " +
            value.example +
            "<br><b>Gesture:</b> " +
            value.gesture +
            "<br><b>Reasons:</b>: " +
            value.reasons +
            "</div>";
          notes =
            "<div class='col-md-3'><b>Notes:</b> " +
            value.notes +
            "<br><b>Evaluation:</b> " +
            value.Evaluation[0] +
            ", " +
            value.Evaluation[1] +
            ", " +
            value.Evaluation[2] +
            "<br><b>CAT experience:</b> " +
            data.experience +
            "<br><b>Age:</b> " +
            data.age +
            "<br><b>Gender:</b> " +
            data.gender +
            "</div>";
          video =
            "<div class='col-md-2'><div class='row'><div class='col-md-12'><video loop autoplay muted width='320' height='160'><source src='vids/p" +
            data.id +
            "-" +
            value.order +
            ".mp4' type='video/mp4'></video></div></div></div>";
          $(".content").append(
            '<div class="row m-4">' + order + desc + notes + video + "</div>"
          );
          $("#title").html("<< Participant " + pid + " >>");
        });
      }).fail(function () {
        console.log("An error has occurred.");
      });
    }
    // no value is set
    else {
      alert("Select an operation or a participant");
    }
  }
  function getParameterValues(param) {
    var url = window.location.href
      .slice(window.location.href.indexOf("?") + 1)
      .split("&");
    for (var i = 0; i < url.length; i++) {
      var urlparam = url[i].split("=");
      if (urlparam[0] == param) {
        return urlparam[1];
      }
    }
  }
  function getClusters(operation) {
    var file = "clusters/" + operation + ".json";
    $.getJSON(file, function (data) {
      console.log(data);
      var selection = data.selection;
      var gestures = data.gestures;
      var comments = data.Comments;
      var conclusion = data.conclusion;
      var ar_selection = data.ar_selection;
      var ar_operation = data.ar_gestures;
      var title = data.operation;
      var operation_title = title + " (AR: " + ar_operation + ")";
      var selection_title = "Selection" + " (AR: " + ar_selection + ")";
      setTimeout(function () {
        addCluster(selection_title, selection, operation);
      }, 1000);
      setTimeout(function () {
        addCluster(operation_title, gestures, operation);
      }, 2000);
      setTimeout(function () {
        addComments(comments);
      }, 3000);
      setTimeout(function () {
        addConclusion(conclusion);
      }, 4000);
      setTimeout(function () {
        addIdeas();
      }, 6000);
    }).fail(function () {
      console.log("An error has occurred.");
    });
  }
  function addIdeas(){
    var file = "comments/comments.json"
    var rows = ""
    $.getJSON(file, function (data) {
      var comments = data.comments;
      $.each(comments, function (index, value) {
        participant = value.participant;
        text = value.text;
        rows +=
          "<tr>" +
          '<th scope="row">' +
          (index + 1) +
          "</th>" +
          "<td>p" +
          participant +
          "</td>" +
          "<td>" +
          text +
          "</td>" ;
      });
      var title =
        '<div><p class="text-capitalize font-weight-bold m-4" id="clusterid">General Comments/Ideas</p></div>';
      var table =
        '<div class="row m-4"> ' +
        '<table class="table table-striped">' +
        "<thead>" +
        "<tr>" +
        '<th scope="col">#</th>' +
        '<th scope="col">Participant</th>' +
        '<th scope="col">Comment</th>' +
        "</tr>" +
        "</thead>" +
        '<tbody class="clustersTable">' +
        rows +
        "</tbody>" +
        "</table>" +
        "</div>";
      $(".clusters").append(title);
      $(".clusters").append(table);
    }).fail(function () {
      console.log("An error has occurred.");
    });
  }
  function addComments(comments) {
    var rows = '';
    $.each(comments, function (index, value) {
      var participant = value.participant;
      var text = value.text;
      rows +=
        "<tr>" +
        '<th scope="row">' +
        (index + 1) +
        "</th>" +
        "<td>p" +
        participant +
        "</td>" +
        "<td>" +
        text +
        "</td>" ;
    });
    var title =
      '<div><p class="text-capitalize font-weight-bold m-4" id="clusterid">Operation related comments</p></div>';
    var table =
      '<div class="row m-4"> ' +
      '<table class="table table-striped">' +
      "<thead>" +
      "<tr>" +
      '<th scope="col">#</th>' +
      '<th scope="col">Participant</th>' +
      '<th scope="col">Comment</th>' +
      "</tr>" +
      "</thead>" +
      '<tbody class="clustersTable">' +
      rows +
      "</tbody>" +
      "</table>" +
      "</div>";
    $(".clusters").append(title);
    $(".clusters").append(table);
  }
  function addConclusion(conclusions) {
    var title =
      '<div><p class="text-capitalize font-weight-bold m-4" id="clusterid">Conclusion</p></div>';
    var content = '<div class="row m-4"> ' + "<p>final conclusion presented in my thesis</p>" + "</div>";
    $(".clusters").append(title);
    $(".clusters").append(content);
  }
  // return a string of all participants IDs
  function getParticipants(participants) {
    var rtn = "";
    $.each(participants, function (index, value) {
      rtn += "p" + value + " ";
    });
    return rtn;
  }
  function addCluster(opTitle, option, operation) {
    var rows = "";
    var evaluations = "";
    var sd = 0;
    var avg = 0;
    $.each(option, function (index, value) {
      desc = value.desc;
      participants = getParticipants(value.participants);
      score = value.participants.length;
      avg = "";
      avg =
        "Match: " +
        value.avg[0] +
        " (SD: " +
        value.sd[0] +
        ")" +
        "<br> Easiness: " +
        value.avg[1] +
        " (SD: " +
        value.sd[1] +
        ")" +
        "<br> Replacement: " +
        value.avg[2] +
        " (SD: " +
        value.sd[2] +
        ")";
      ar = "NA";
      rows +=
        "<tr>" +
        '<th scope="row">' +
        (index + 1) +
        "</th>" +
        "<td>" +
        desc +
        "</td>" +
        "<td>" +
        participants +
        "</td>" +
        "<td>" +
        avg +
        "</td>" +
        "<td>" +
        score +
        "</td>" +
        "<td>" 
    });

    var title =
      '<div><p class="text-capitalize font-weight-bold m-4" id="clusterid">' +
      opTitle +
      "</p></div>";
    var table =
      '<div class="row m-4"> ' +
      '<table class="table table-striped">' +
      "<thead>" +
      "<tr>" +
      '<th scope="col">#</th>' +
      '<th scope="col">Description</th>' +
      '<th scope="col">Participants</th>' +
      '<th scope="col">Evaulations</th>' +
      '<th scope="col">Agreement score</th>' +
      "</tr>" +
      "</thead>" +
      '<tbody class="clustersTable">' +
      rows +
      "</tbody>" +
      "</table>" +
      "</div>";
    $(".clusters").append(title);
    $(".clusters").append(table);
  }
  init();
});
