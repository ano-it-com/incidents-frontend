.PHONY: *

deploy:
	make -C docker/deploy/${CI_COMMIT_REF_SLUG} $@
