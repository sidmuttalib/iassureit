<div id ="<?php print $rating_id; ?>" class="rating-block <?php if ($class) print $class; ?>">   
    <img class="client-image" alt="" src="<?php if($image) print $image;?>"/>
        <p><?php if($content) print $content;?></p>
        <div class="testimonial_meta clearfix">
            <div class="pull-left">
                <p>
                  <span><?php if($name) print $name;?></span><?php if($position) print " - ".$position;?>
                </p>
            </div>	
            <div class="pull-right">
                <div class="rating text-center">
                    <?php for($i=0;$i<$stars; $i++):?>
                    <i class="fa fa-star">&nbsp;</i>
                    <?php endfor;?>
                    <?php for($i=0;$i<5-$stars; $i++):?>
                    <i class="fa fa-star-o">&nbsp;</i>
                    <?php endfor;?>                    
                </div><!-- rating -->
            </div>	        
        </div><!-- testimonial_desc -->                 
</div>