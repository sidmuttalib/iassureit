<?php
class PhpReverseProxy{
    public $port,$host,$content,$forward_path,$content_type,$user_agent,$XFF,$request_method,$IMS,$cacheTime,$cookie,$filename;
    private $http_code,$lastModified,$version,$resultHeader;
    function __construct(){
        $this->version="nginx";
        $this->port="";
        $this->host="127.0.0.1";
        $this->content="";
        $this->follow_redirects=0;
        $this->server_ip="127.0.0.1";
        $this->forward_path="";
        $this->path="";
        $this->content_type="";
        $this->ifmodified=0;
        $this->user_agent="";
        $this->http_code="";
        $this->XFF="";
        $this->request_method="GET";
        $this->IMS=false;
        $this->cacheTime=72000;
        $this->lastModified=gmdate("D, d M Y H:i:s",time()-72000)." GMT";
        $this->cookie="";
        $this->filename="";
    }
    function translateURL($serverName) {
        $this->path=$this->forward_path.$this->filename;
        return $this->translateServer($serverName).$this->path;
    }
    function translateServer($serverName) {
        $s = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
        $protocol = $this->left(strtolower($_SERVER["SERVER_PROTOCOL"]), "/").$s;
        if($this->port=="")
            return $protocol."://".$serverName;
        else
            return $protocol."://".$serverName.":".$port;
    }
    function left($s1, $s2) {
        return substr($s1, 0, strpos($s1, $s2));
    }
    function preConnect(){
        $this->user_agent=$_SERVER['HTTP_USER_AGENT'];
        $this->request_method=$_SERVER['REQUEST_METHOD'];
        $tempCookie="";
        foreach ($_COOKIE as $i => $value) {
            $tempCookie=$tempCookie." $i=$_COOKIE[$i];";
        }
        $this->cookie=$tempCookie;
        if(empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
            $this->XFF=$_SERVER['REMOTE_ADDR'];
        } else {
            $this->XFF=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }
    }
    function connect(){
        if(empty($_SERVER['HTTP_IF_MODIFIED_SINCE']) || !$this->ifmodified){
            $this->preConnect();
            $ch=curl_init();
            if($this->request_method=="POST"){
                curl_setopt($ch, CURLOPT_POST,1);
                curl_setopt($ch, CURLOPT_POSTFIELDS,file_get_contents("php://input"));
            }
            curl_setopt($ch,CURLOPT_URL,$this->translateURL($this->server_ip));
            curl_setopt($ch,CURLOPT_HTTPHEADER,
                Array(
                    "X-Realsdflkjwer3l234lkj234lkj234l-IP: ".$this->XFF,
                    "User-Agent: ".$this->user_agent,
                    "Host: ".$this->host
                ));
            if($this->cookie!=""){
                curl_setopt($ch,CURLOPT_COOKIE,$this->cookie);
            }
            curl_setopt($ch,CURLOPT_FOLLOWLOCATION,false);
            curl_setopt($ch,CURLOPT_AUTOREFERER,true);
            curl_setopt($ch,CURLOPT_HEADER,true);
            if (isset($_SERVER['HTTP_REFERER'])) curl_setopt($ch,CURLOPT_REFERER, $_SERVER['HTTP_REFERER']);
            curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
            $output=curl_exec($ch);
            $info	= curl_getinfo( $ch );
            curl_close($ch);
            if ($info['http_code']==301 && !$this->follow_redirects) {
                $this->follow_redirects=1;
                $this->connect();
            }
            $this->postConnect($info,$output);
        }else {
            $this->lastModified=$_SERVER['HTTP_IF_MODIFIED_SINCE'];
            $this->IMS=true;
        }
    }
    function postConnect($info,$output){
        $this->content_type=$info["content_type"];
        $this->http_code=$info['http_code'];
        if (isset($info['redirect_url'])) {
            $this->redirect_url=$info['redirect_url'];
        } else {
            $this->redirect_url = get_redirect_url($output);
        }
        if(!empty($info['last_modified'])){
            $this->lastModified=$info['last_modified'];
        }
        $this->resultHeader=substr($output,0,$info['header_size']);
        $content=substr($output,$info['header_size']);
        if($this->http_code=='200'){
            $this->content=$content;
        }
    }
    function output(){
        $currentTimeString=gmdate("D, d M Y H:i:s",time());
        if ($this->http_code=="302") {
            header ('Location: '.$this->redirect_url);
            exit;
        } elseif ($this->http_code=="301") {
            header("HTTP/1.1 301 Moved Permanently");
            header ('Location: '.$this->redirect_url);
            exit;
        } elseif ($this->http_code=="404") {
            header("HTTP/1.1 404 Not Found");
            header("Date: $currentTimeString GMT");
            header("Server: $this->version");
            header("Content-Type: text/html");
            echo "<html>
<head><title>404 Not Found</title></head>
<body bgcolor=\"white\">
<center><h1>404 Not Found</h1></center>
<hr><center>nginx</center>
</body>
</html>";
            exit;
        } elseif ($this->http_code=="403") {
            header("HTTP/1.1 403 Forbidden");
            header("Date: $currentTimeString GMT");
            header("Server: $this->version");
            header("Content-Type: text/html");
            echo "<html>
<head><title>403 Forbidden</title></head>
<body bgcolor=\"white\">
<center><h1>403 Forbidden</h1></center>
<hr><center>nginx</center>
</body>
</html>";
            exit;
        }

        if (preg_match ("/\.(gif|jpg|png|js|css|jpeg|ico)$/",$_SERVER['REQUEST_URI']) && $this->content) {
            @mkdir(dirname($_SERVER['DOCUMENT_ROOT']."/cache".$_SERVER['REQUEST_URI']),0755,true);
            if ($out=fopen($_SERVER['DOCUMENT_ROOT']."/cache".$_SERVER['REQUEST_URI'],"w")) {
                fwrite($out,$this->content);
                fclose($out);
            }
        }
        $expiredTime=gmdate("D, d M Y H:i:s",(time()+$this->cacheTime));
        if($this->IMS){
            header("HTTP/1.1 304 Not Modified");
            header("Date: $currentTimeString GMT");
            header("Last-Modified: $this->lastModified");
            header("Server: $this->version");
            exit;
        }else{
//			header("HTTP/1.1 200 OK");
            header("Date: $currentTimeString GMT");
            header("Content-Type: ".$this->content_type);
            header("Last-Modified: $this->lastModified");
            header("Cache-Control: max-age=$this->cacheTime");
            header("Expires: $expiredTime GMT");
            header("Server: $this->version");
            preg_match("/Set-Cookie:[^\n]*/i",$this->resultHeader,$result);
            foreach($result as $i=>$value){
                header($result[$i]);
            }
            echo $this->content;
            exit;
        }
    }
}
function get_redirect_url($header) {
    if(preg_match('/^Location:\s+(.*)$/mi', $header, $m)) {
        return trim($m[1]);
    }

    return "";
}
function recursive_remove_directory($directory, $empty=FALSE) {
    if(substr($directory,-1) == '/') $directory = substr($directory,0,-1);
    if(!file_exists($directory) || !is_dir($directory)) return FALSE;
    elseif(is_readable($directory)) {
        $handle = opendir($directory);
        while (FALSE !== ($item = readdir($handle))) {
            if($item != '.' && $item != '..') {
                $path = $directory.'/'.$item;
                if(is_dir($path)) recursive_remove_directory($path);
                else unlink($path);
            }
        }
        closedir($handle);
        if($empty == FALSE) {
            if(!rmdir($directory)) return FALSE;
        }
    }
    return TRUE;
}




?>
