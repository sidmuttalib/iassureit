<table>
    <tr>
        <td>Choose video type</td>
        <td colspan="5">
            <select class="form-select layer-option" name="video_type" onchange="video_type_change(this.value)">
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="html5">HTML5</option>
            </select>
        </td>
    </tr>
    <tr id="youtube_video">
        <td>Enter Youtube ID</td>
        <td colspan="5"><input class="layer-option form-text" name="youtube_video"/></td>
    </tr>
    <tr id="vimeo_video">
        <td>Enter Vimeo ID</td>
        <td colspan="5"><input class="layer-option form-text" name="vimeo_video"/></td>
    </tr>
    <tbody id="html5_video">
    <tr>
        <td>Poster Image</td>
        <td colspan="5">
            <input id="imagelayer" class="layer-option file-imce form-text" data-uri="[name=html5_video_poster_uri]" name="html5_video_poster">
            <input name="html5_video_poster_uri" type="hidden" class="layer-option"/>
        </td>
    </tr>
    <tr>
        <td>Video MP4</td>
        <td>
            <input id="imagelayer" class="layer-option form-text" name="html5_video_mp4">
        </td>
        <td>Video WEBM</td>
        <td>
            <input id="imagelayer" class="layer-option form-text" name="html5_video_webm">
        </td>
        <td>Video OGV</td>
        <td>
            <input id="imagelayer" class="layer-option form-text" name="html5_video_ogv">
        </td>
    </tr>
    </tbody>
    <tr>
        <td>
            Full Width
        </td>
        <td>
            <select class="layer-option form-select" onchange="video_fullwidth_change(this.value)" name="video_fullwidth">
                <option value="1">Yes</option>
                <option value="0">No</option>
            </select>
        </td>
        <td class="un-fullwidth">
            Width
        </td>
        <td class="un-fullwidth">
            <input name="video_width" class="form-text layer-option"/>
        </td>
        <td class="un-fullwidth">
            Height
        </td>
        <td class="un-fullwidth">
            <input name="video_height" class="form-text layer-option"/>
        </td>
    </tr>
    <tr>
        <td>Autoplay</td>
        <td>
            <select name="video_autoplay" class="form-select layer-option">
            <option value="0">No</option>
            <option value="1">Yes</option>
          </select>
        </td>
        <td>Mute</td>
        <td>
            <select name="video_mute" class="form-select layer-option">
                <option value="1">Yes</option>
                <option value="0">No</option>
            </select>
        </td>
        <td>Loop</td>
        <td>
            <select name="video_loop" class="form-select layer-option">
                <option value="none">None</option>
                <option value="loop">Loop</option>
                <option value="loopandnoslidestop">Loop and no slide stop</option>
            </select>
        </td>
    </tr>
    <tr>
        <td>Controls</td>
        <td>
            <select name="video_controls" class="form-select layer-option">
                <option value="1">Yes</option>
                <option value="0">No</option>
            </select>
        </td>
        <td>Next Slide at End</td>
        <td colspan="3">
            <select name="video_nextslideatend" class="form-select layer-option">
                <option value="1">Yes</option>
                <option value="0">No</option>
            </select>
        </td>
    </tr>
</table>
<script type="text/javascript">
    function video_type_change(video_type){
        var visible_tab_id = '#'+ video_type+'_video';
        jQuery('#youtube_video,#vimeo_video,#html5_video').hide();
        jQuery(visible_tab_id).show();
    }
    function video_fullwidth_change(val){
        if(parseInt(val)===1){
            jQuery('td.un-fullwidth').css('visibility','hidden');
        }else{
            jQuery('td.un-fullwidth').css('visibility','visible');
        }
    }
</script>