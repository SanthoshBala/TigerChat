


<!DOCTYPE html PUBLIC "-//WAPFORUM//DTD XHTML Mobile 1.1//EN" "http://www.openmobilealliance.org/tech/DTD/xhtml-mobile11.dtd">
<!-- Minimal Web pages, starting point for Web Designers -->

<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<title>Princeton University Authentication Service</title>
<meta HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=iso-8859-1">
<meta HTTP-EQUIV="Pragma" CONTENT="no-cache">
<meta HTTP-EQUIV="Cache-Control" CONTENT="no-cache">
<meta HTTP-EQUIV="Expires" CONTENT="Wed, 21 Mar 2007 17:01:00 GMT">
<link media="only screen and (max-device-width: 480px)" rel="stylesheet" href="/cas/themes/default/small.css" type="text/css">
<link media="only screen and (min-device-width: 481px)" rel="stylesheet" href="/cas/themes/default/princeton.css" type="text/css">
<!--[if IE]>
<link rel="stylesheet" href="/cas/themes/default/princeton.css" type="text/css">
<![endif]-->
<script language="javascript" type="text/javascript">
        <!--
        function focusLogin() {
        document.forms[0].username.focus();
        }

        function focusLogout() {
        document.forms[0].verify.focus();
        }
        function helpPopup() {
        window.open( "http://kb.princeton.edu/9921/", "Help","title=0, status = 0, height = 400, width = 700, resizable = 1, scrollbars=1" )
        }

       //  -->
    </script>
</head>
<body onLoad="if ( window != top ) top.location.href = window.location.href; focusLogin()">
<form method="post" autocomplete="off" action="https://fed.princeton.edu/cas/login?service=http%3A//www.cs.princeton.edu/courses/archive/spring12/cos333/CAS/CAStestpy.cgi">
  <!--Content-->
  <div id="wrapper">
     <script language="javascript" type="text/javascript">
        <!--
        function helpWindow() {
           helpWin = window.open( "http://kb.princeton.edu/9921/", "Help","title=0, status = 0, height = 400, width = 700, resizable = 1, scrollbars=1" );
           if (window.focus) { helpWin.focus() }
           return false;
        }
       //  -->
    </script>
    <div id="toolbarcontainer">
      <div id="toolbar">
         <a href="http://www.princeton.edu/"><img src="/cas/images/pu_signature_web.jpg" alt="Princeton University"/></a>
      <!-- img src="/cas/images/help.gif" alt="Help" id="help" onClick="helpWindow()" border="0" style="cursor:help;"/ -->
        <a href="http://kb.princeton.edu/9921/"  onClick="helpWindow();return false" id="helplink"><img src="/cas/images/help.gif" alt="Help" id="help" border="0"/></a>
      </div>
    </div>


        <div id="headercontainer">
      <div id="header">
          <!-- img src="/cas/images/banner.png" alt="Central Authentication Service" / -->
          <div id="casTitle">Central Authentication Service </div>
      </div>
    </div>
    <br/>
    <div id="borderContainer">
    <div id="contentcontainer">
      <div id="content">
        <div class="errorBlock">
        <!-- Begin error message generating Server-Side tags -->
        
        <!-- End error message generating Server-Side tags -->
        </div>
        <img src="/cas/images/padlock.jpg" alt="Security" class="right" />
        <div class="block">
          <div class="title"><b>NetID</b></div>
          <input id="username" name="username" size="25" value="" type="text" tabindex="1" accesskey="n">
        </div>
        
        <div class="block">
          <div class="title"><b>Password</b></div>
          <input value="" size="25" id="password" name="password" autocomplete="off" type="password" tabindex="2" accesskey="p" >
        </div>
        <br/>
           <div class="login">
           <p>
            <input type="image" class="button"  src="/cas/images/login_T.gif" accesskey="l" value="Login" tabindex="4" alt="login" />
           </p>
           </div>
        <div class="block">
        <p class="wide"><input type="checkbox" id="warn" name="warn" value="false" tabindex="3" />
          Prompt me before logging into other CAS protected sites.</p>
        </div>
          <!-- The following hidden field must be part of the submitted Form -->
          <input type="hidden" name="lt" value="_c73DA1DDA-9469-3B91-E718-675E4CA3D8A4_kCBA20E2C-2A7D-1D53-8041-40F0A1D72324" />
          <input type="hidden" name="_eventId" value="submit" />

            <script language="javascript" type="text/javascript">
        <!--
        function passwordPopup()
        {
          passWin = window.open( "changepassword.html", "Password","title=0, status = 0, height = 400, width = 700, resizable = 1, scrollbars=1" );
          passWin.focus()
          return false;
        }

       //  -->
    </script>   
    <p class="box">
        <a href="changepassword.html" onclick="passwordPopup();return false" id="helplink">Change your Password</a>
    </p>



      </div>
    </div>
    </div>
        <div id="footercontainer">
      <div id="footer">
            &copy; 2010 The Trustees of <a href="http://www.princeton.edu">Princeton University</a>
      </div>
    </div>
  </div>


    <!--
    <div id="footercontainer">
      <div id="footer">
            <ul>
                <li>&copy; 2008 The Trustees of <a href="http://www.princeton.edu">Princeton University</a></li>
            </ul>
      </div>
    </div>
  </div>
  -->
  <!--<script src="https://siteseal.thawte.com/cgi/server/thawte_seal_generator.exe">-->
</form>
</body>
</html>

