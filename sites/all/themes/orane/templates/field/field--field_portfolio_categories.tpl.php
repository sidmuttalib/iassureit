<?php

$i = 0;
$categories = '';
?>
<?php

foreach ($items as $delta => $item):
    if ($i == 0) {
        print render($item);
    } else {
        print ', ' . render($item);
    }
    $i++;
endforeach;
?>