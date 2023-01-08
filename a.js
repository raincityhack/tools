var SecondPwd = function SecondPwd() {
  this.requestFlag = false;
  this.wait = 60;
  this.phoneFlag = 0;
  this.mailFlag = 0;
  this.questionFlag = 0;
  this.wait2 = 60;
};

var PwdType = {
  phone: 1,
  mail: 2,
  question: 3
};

SecondPwd.prototype.sendCode = function() {
  if (this.requestFlag) {
    return;
  }
  var type = $("#type").val();
  if (type == PwdType.phone && this.wait != 60) {
    return;
  }
  if (type == PwdType.mail && this.wait2 != 60) {
    return;
  }
  var url = "../safe/resetPwdGetPhoneCode.do";
  var param = {};
  if (type == PwdType.phone) {
    var preBindPhone = $("#phone").val();
    if (preBindPhone == null || preBindPhone == "") {
      this.showFailMsg("Nomor HP yang kamu masukkan salah.");
      return;
    }
    if (!this.isRightPhone(preBindPhone)) {
      this.showFailMsg("Nomor HP yang kamu masukkan salah.");
      return;
    }
    param["bindPhone"] = preBindPhone;
  } else {
    url = "../safe/resetPwdGetMailCode.do";
    var preBindMail = $("#email").val();
    if (preBindMail == null || preBindMail == "") {
      this.showFailMsg("Alamat email tidak boleh kosong.");
      return;
    }
    if (!this.isRightMail(preBindMail)) {
      this.showFailMsg("Format email salah.");
      return;
    }
    param["bindMail"] = preBindMail;
  }
  var userId = $("#userId").val();
  param["userId"] = userId;
  this.requestFlag = true;
  var self = this;
  $.ajax({
    url: url,
    type: 'post',
    cache: false,
    async: true,
    dataType: 'json',
    data: param,
    success: function success(data) {
      if (data.code == 0) {
        if (type == PwdType.phone) {
          self.showSuccessMsg("Sebentar lagi kami akan memberikan kode verifikasi Anda melalui panggilan telepon.");
          self.time($("#codePhoneButton"));
        } else {
          self.showSuccessMsg("Kode verifikasi telah dikirim, silahkan cek email (jika tidak ada , silakan periksa spam).");
          self.time2($("#codeMailButton"));
        }
        self.requestFlag = false;
      } else {
        self.showFailMsg(data.message);
        self.requestFlag = false;
      }
    },
    error: function error() {
      self.requestFlag = false;
      self.showFailMsg("Kesalahan sistem, harap beroperasi kembali.");
    }
  });
};

//发送短信
SecondPwd.prototype.time = function($obj) {
  if (this.wait == 0) {
    $obj.html("Dapatkan");
    this.wait = 60;
  } else {
    $obj.html("Dapatkan(" + this.wait + ")");
    this.wait--;
    var self = this;
    setTimeout(function() {
      self.time($obj);
    }, 1000);
  }
};

SecondPwd.prototype.time2 = function($obj) {
  if (this.wait2 == 0) {
    $obj.html("Dapatkan");
    this.wait2 = 60;
    this.requestFlag = false;
  } else {
    $obj.html("Dapatkan(" + this.wait2 + ")");
    this.wait2--;
    var self = this;
    setTimeout(function() {
      self.time2($obj);
    }, 1000);
  }
};

SecondPwd.prototype.isRightPhone = function(phoneNum) {
  if (phoneNum.length < 10 || phoneNum.length > 15) {
    return false;
  }
  var arr = ["0811", "0812", "0813", "0821", "0822", "0823", "0852", "0853", "0851", "0855", "0856", "0857", "0858", "0814", "0815", "0816", "0817", "0818", "0819", "0859", "0877", "0878", "0831", "0832", "0838", "0895", "0896", "0897", "0898", "0899", "0881", "0882", "0883", "0884", "0885", "0886", "0887", "0888", "0889", "998", "999"];
  for (var i = 0; i < arr.length; i++) {
    if (phoneNum.indexOf(arr[i]) == 0) {
      return true;
    }
  }
  return false;
};

SecondPwd.prototype.isRightMail = function(mailUrl) {
  var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  return reg.test(mailUrl);
};

SecondPwd.prototype.setPwd = function() {
  // if (this.requestFlag) {
  //     return;
  // }
  var type = $("#type").val();
  var param = {};
  var userId = $("#userId").val();
  var phoneNum = $("#phone").val();
  var mail = $("#email").val();
  var code = $("#phoneCode").val();
  if (type == PwdType.mail) {
    code = $("#mailCode").val();
  }
  var passward = $("#pwd").val();
  var surePwd = $("#surePwd").val();
  var queId1 = $("#queId1").val();
  var queId2 = $("#queId2").val();
  var content1 = $("#answer1").val();
  var content2 = $("#answer2").val();

  param["type"] = type;
  param["userId"] = userId;
  param["code"] = code;
  param["bindPhone"] = phoneNum;
  param["bindMail"] = mail;
  param["password"] = passward;
  param["questIdx1"] = queId1;
  param["answer1"] = content1;
  param["questIdx2"] = queId2;
  param["answer2"] = content2;

  if (type == PwdType.phone) {
    if (phoneNum == null || phoneNum == "") {
      this.showFailMsg("Silakan masukkan nomor ponsel Anda yang terikat.");
      return;
    }
    if (code == null || code == "") {
      this.showFailMsg("Silakan masukan nomor verifikasi yang tepat.");
      return;
    }
  } else if (type == PwdType.mail) {
    if (mail == null || mail == "") {
      this.showFailMsg("Alamat email tidak boleh kosong.");
      return;
    }
    if (code == null || code == "") {
      this.showFailMsg("Silakan masukan nomor verifikasi yang tepat.");
      return;
    }
  } else {
    if (!content1 || !content2) {
      this.showFailMsg("Silakan isi jawaban pertanyaan keamanan.");
      return;
    }
  }
  if (passward == null || passward == "") {
    this.showFailMsg("Silakan masukkan keamanan password.");
    return;
  }
  if (passward.length < 6 || passward.length > 16) {
    this.showFailMsg("Tidak sesuai, kata sandi harus 6-16 angka atau huruf.");
    return;
  }

  var passwordReg = new RegExp(/^(?![^a-zA-Z]+$)(?!\D+$)/);
  if (!passwordReg.test(passward)) {
    this.showFailMsg("Kata sandi harus terdiri dari kombinasi 6-16 angka dan huruf!");
    return;
  }

  if (surePwd == null || surePwd == "") {
    this.showFailMsg("Masukkan kembali kata sandi.");
    return;
  }
  if (passward != surePwd) {
    this.showFailMsg("Kata sandi yang dimasukkan ke-2 x berbeda.");
    return;
  }

  //new add
  param["ifNoLogin"] = this.getParam("ifNoLogin");
  param["userToken"] = this.getParam("userToken");
  param["tempToken"] = this.getParam("tempToken");
  param["mac"] = this.getParam("mac");
  param["version"] = this.getParam("version");

  //encode
  param["password"] = hex_md5(passward);
  param["answer1"] = $.base64.encode(content1);
  param["answer2"] = $.base64.encode(content2);


  var self = this;

  var sliderVerify = new SliderVerify({
    appId: 1009,
    fixed: true,
    defaultVisible: true
  });

  var captchaIfOpen = $("#captchaIfOpen").val();
  if (captchaIfOpen == 1) {
    sliderVerify.show(function(captcha, capCode) {
      param["ticket"] = sliderVerify.ticket;
      param["captcha"] = capCode;
      console.log(param);

      //join
      var paramData = self.toQueryString(param);
      paramData = self.toHex(paramData);

      $.ajax({
        url: "../safe/resetPwdCommit.do",
        cache: false,
        type: "post",
        dataType: "json",
        async: false,
        data: "v=" + paramData,
        success: function success(data) {
          if (data && data.code == 0) {
            $("#thickdiv").show();
            $("#newPwd").text(passward);
            $("#successful-reset").show();

            var param = "lobby_event_id_49";
            if (Webkit.isAndroid()) {
              window.wst.CallbackByJS(param, false);
            } else if (Webkit.isIos() || Webkit.isPad()) {
              // IOS回调
              window.location.hash = "#objc&param=" + param + "&close=false";
            }
          } else {
            self.showFailMsg(data.message);
          }
          self.requestFlag = false;
        },
        error: function error() {
          self.showFailMsg("Kesalahan sistem, harap beroperasi kembali.");
          self.requestFlag = false;
        }
      });
    });
  } else {
    //join
    var paramData = self.toQueryString(param);
    paramData = self.toHex(paramData);

    $.ajax({
      url: "../safe/resetPwdCommit.do",
      cache: false,
      type: "post",
      dataType: "json",
      async: false,
      data: "v=" + paramData,
      success: function success(data) {
        if (data && data.code == 0) {
          $("#thickdiv").show();
          $("#newPwd").text(passward);
          $("#successful-reset").show();

          var param = "lobby_event_id_49";
          if (Webkit.isAndroid()) {
            window.wst.CallbackByJS(param, false);
          } else if (Webkit.isIos() || Webkit.isPad()) {
            // IOS回调
            window.location.hash = "#objc&param=" + param + "&close=false";
          }
        } else {
          self.showFailMsg(data.message);
        }
        self.requestFlag = false;
      },
      error: function error() {
        self.showFailMsg("Kesalahan sistem, harap beroperasi kembali.");
        self.requestFlag = false;
      }
    });
  }

};

SecondPwd.prototype.closeSureDiv = function() {
  $("#thickdiv").hide();
  $("#newPwd").text("");
  $("#successful-reset").hide();
  this.closePage();
};

SecondPwd.prototype.showFailMsg = function(msg) {
  $("#thickdiv").show();
  $("#errorText").text(msg);
  $("#failDiv").show();
};

SecondPwd.prototype.closeFailDiv = function() {
  $("#thickdiv").hide();
  $("#errorText").text("");
  $("#failDiv").hide();
};

SecondPwd.prototype.showSuccessMsg = function(msg) {
  $("#thickdiv").show();
  $("#successText").text(msg);
  $("#successDiv").show();
};

SecondPwd.prototype.closeSuccessDiv = function() {
  $("#thickdiv").hide();
  $("#successText").text("");
  $("#successDiv").hide();
};

SecondPwd.prototype.goBack = function() {
  window.location.href = "shopIndex.do";
};

SecondPwd.prototype.closePage = function() {
  var param = "change_pwd_" + $("#userId").val() + "_" + $("#pwd").val();
  if (Webkit.isAndroid()) {
    window.wst.CallbackByJS(param, true);
  } else if (Webkit.isIos() || Webkit.isPad()) {
    // IOS回调
    window.location.hash = "#objc&param=" + param + "&close=true";
  }
};

SecondPwd.prototype.closePageDirectly = function() {
  if (Webkit.isAndroid()) {
    window.wst.CallbackByJS("", true);
  } else if (Webkit.isIos() || Webkit.isPad()) {
    // IOS回调
    window.location.hash = "#objc&param=&close=true";
  }
};

SecondPwd.prototype.changeType = function() {
  var type = $("#type").val();
  $(".phoneDiv").hide();
  $(".mailDiv").hide();
  $(".questionDiv").hide();
  if (type == PwdType.phone) {
    if (this.mailFlag > 0) {
      $("#type").val(PwdType.mail);
      $(".mailDiv").show();
    } else {
      $("#type").val(PwdType.question);
      $(".questionDiv").show();
    }
  } else if (type == PwdType.mail) {
    if (this.questionFlag > 0) {
      $("#type").val(PwdType.question);
      $(".questionDiv").show();
    } else {
      $("#type").val(PwdType.phone);
      $(".phoneDiv").show();
    }
  } else if (type == PwdType.question) {
    if (this.phoneFlag > 0) {
      $("#type").val(PwdType.phone);
      $(".phoneDiv").show();
    } else {
      $("#type").val(PwdType.mail);
      $(".mailDiv").show();
    }
  }
};

SecondPwd.prototype.initShow = function() {
  var bindPhone = $("#bindPhone").val();
  if (bindPhone) {
    this.phoneFlag = 1;
  }
  var bindMail = $("#bindMail").val();
  if (bindMail) {
    this.mailFlag = 1;
  }
  var queId2 = $("#queId2").val();
  if (queId2 > 0) {
    this.questionFlag = 1;
  }
  $(".phoneDiv").hide();
  $(".mailDiv").hide();
  $(".questionDiv").hide();
  if (parseInt(this.questionFlag) + parseInt(this.phoneFlag) + parseInt(this.mailFlag) < 2) {
    $("#change").hide();
  }
  if (this.phoneFlag > 0) {
    $(".phoneDiv").show();
    $("#type").val(PwdType.phone);
    return;
  }
  if (this.mailFlag > 0) {
    $(".mailDiv").show();
    $("#type").val(PwdType.mail);
    return;
  }
  $(".questionDiv").show();
  $("#type").val(PwdType.question);
};

SecondPwd.prototype.getParam = function(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return '';
};

SecondPwd.prototype.toHex = function(originStr) {

  var bytes = this.writeUTF(originStr);

  var hex = "";
  var hex_tables = "0123456789ABCDEF";
  for (var i = 0; i < bytes.length; i++) {
    hex += hex_tables.charAt((bytes[i] & 0xf0) >> 4);
    hex += hex_tables.charAt((bytes[i] & 0x0f) >> 0);
  }

  return hex;
};

// 将字符串格式化为UTF8编码的字节
SecondPwd.prototype.writeUTF = function(str) {
  var isGetBytes = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

  var back = [];
  var byteSize = 0;
  for (var i = 0; i < str.length; i++) {
    var code = str.codePointAt(i);
    if (0x00 <= code && code <= 0x7f) {
      byteSize += 1;
      back.push(code);
    } else if (0x80 <= code && code <= 0x7ff) {
      byteSize += 2;
      back.push(192 | 31 & code >> 6);
      back.push(128 | 63 & code);
    } else if (0x800 <= code && code <= 0xd7ff || 0xe000 <= code && code <= 0xffff) {
      byteSize += 3;
      back.push(224 | 15 & code >> 12);
      back.push(128 | 63 & code >> 6);
      back.push(128 | 63 & code);
    } else if (0x10000 <= code && code <= 0x10ffff) {
      byteSize += 4;
      back.push(240 | 7 & code >> 18);
      back.push(128 | 63 & code >> 12);
      back.push(128 | 63 & code >> 6);
      back.push(128 | 63 & code);
    }
  }
  for (var i = 0; i < back.length; i++) {
    back[i] &= 0xff;
  }
  if (isGetBytes) {
    return back;
  }
  if (byteSize <= 0xff) {
    return [0, byteSize].concat(back);
  } else {
    return [byteSize >> 8, byteSize & 0xff].concat(back);
  }
};

SecondPwd.prototype.toQueryString = function(params) {
  var str = '';
  for (var Key in params) {
    str += Key + '=' + params[Key] + '&';
  }

  return str.substr(0, str.length - 1);
};


function init() {
  var pwd = new SecondPwd();
  window.pwd = pwd;
  pwd.initShow();

  // sliderVerify = new SliderVerify({
  //     appId: 1009, // 验证中心分配
  //     fixed: true,
  //     defaultVisible: false
  // });

  // initPookVerify('../newGetCaptchaInfo.do', 'validator_net_index_reg', '../checkCaptchaInfo.do', 1009);
}

init();
