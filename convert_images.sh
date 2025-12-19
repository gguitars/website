#!/bin/bash
find assets -name "*.avif" -print0 | while IFS= read -r -d $'\0' file; do
    mogrify -format webp "$file"
    rm "$file"
done
